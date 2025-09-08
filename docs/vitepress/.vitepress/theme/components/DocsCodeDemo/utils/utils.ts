// @ts-nocheck

// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad
// Some of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// However, the vast majority of the codebase has diverged from UZIP.js to increase performance and reduce bundle size.
// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).

// aliases for shorter compressed code (most minifers don't do this)
const u8 = Uint8Array
const u16 = Uint16Array
const i32 = Int32Array
// fixed length extra bits
const fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */ 0,
  0, /* impossible */
  0,
])
// fixed distance extra bits
const fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */ 0,
  0,
])
// code length index map
const clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
// get base, reverse index map from extra bits
function freb(eb, start) {
  const b = new u16(31)
  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1]
  }
  // numbers here are at max 18 bits
  const r = new i32(b[30])
  for (var i = 1; i < 30; ++i) {
    for (let j = b[i]; j < b[i + 1]; ++j) {
      r[j] = ((j - b[i]) << 5) | i
    }
  }
  return { b, r }
}
const _a = freb(fleb, 2)
const fl = _a.b
const revfl = _a.r
// we can ignore the fact that the other numbers are wrong; they never happen anyway
;(fl[28] = 258), (revfl[258] = 28)
const _b = freb(fdeb, 0)
const fd = _b.b
const revfd = _b.r
// map of value to reverse (assuming 16 bits)
const rev = new u16(32768)
for (var i = 0; i < 32768; ++i) {
  // reverse table algorithm from SO
  let x = ((i & 0xAAAA) >> 1) | ((i & 0x5555) << 1)
  x = ((x & 0xCCCC) >> 2) | ((x & 0x3333) << 2)
  x = ((x & 0xF0F0) >> 4) | ((x & 0x0F0F) << 4)
  rev[i] = (((x & 0xFF00) >> 8) | ((x & 0x00FF) << 8)) >> 1
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
function hMap(cd, mb, r) {
  const s = cd.length
  // index
  let i = 0
  // u16 "map": index -> # of codes with bit length = index
  const l = new u16(mb)
  // length of cd must be 288 (total # of codes)
  for (; i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1]
  }
  // u16 "map": index -> minimum code for bit length = index
  const le = new u16(mb)
  for (i = 1; i < mb; ++i) {
    le[i] = (le[i - 1] + l[i - 1]) << 1
  }
  let co
  if (r) {
    // u16 "map": index -> number of actual bits, symbol for code
    co = new u16(1 << mb)
    // bits to remove for reverser
    const rvb = 15 - mb
    for (i = 0; i < s; ++i) {
      // ignore 0 lengths
      if (cd[i]) {
        // num encoding both symbol and bits read
        const sv = (i << 4) | cd[i]
        // free bits
        const r_1 = mb - cd[i]
        // start value
        let v = le[cd[i] - 1]++ << r_1
        // m is end value
        for (let m = v | ((1 << r_1) - 1); v <= m; ++v) {
          // every 16 bit value starting with the code yields the same result
          co[rev[v] >> rvb] = sv
        }
      }
    }
  }
  else {
    co = new u16(s)
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> (15 - cd[i])
      }
    }
  }
  return co
}
// fixed length tree
const flt = new u8(288)
for (var i = 0; i < 144; ++i) flt[i] = 8
for (var i = 144; i < 256; ++i) flt[i] = 9
for (var i = 256; i < 280; ++i) flt[i] = 7
for (var i = 280; i < 288; ++i) flt[i] = 8
// fixed distance tree
const fdt = new u8(32)
for (var i = 0; i < 32; ++i) fdt[i] = 5
// fixed length map
const flm = /*#__PURE__*/ hMap(flt, 9, 0)
const flrm = /*#__PURE__*/ hMap(flt, 9, 1)
// fixed distance map
const fdm = /*#__PURE__*/ hMap(fdt, 5, 0)
const fdrm = /*#__PURE__*/ hMap(fdt, 5, 1)
// find max of array
function max(a) {
  let m = a[0]
  for (let i = 1; i < a.length; ++i) {
    if (a[i] > m)
      m = a[i]
  }
  return m
}
// read d, starting at bit p and mask with m
function bits(d, p, m) {
  const o = (p / 8) | 0
  return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m
}
// read d, starting at bit p continuing for at least 16 bits
function bits16(d, p) {
  const o = (p / 8) | 0
  return (d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7)
}
// get end of byte
function shft(p) {
  return ((p + 7) / 8) | 0
}
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
function slc(v, s, e) {
  if (s == null || s < 0)
    s = 0
  if (e == null || e > v.length)
    e = v.length
  // can't use .constructor in case user-supplied
  const n = new u8(e - s)
  n.set(v.subarray(s, e))
  return n
}
// error codes
const ec = [
  'unexpected EOF',
  'invalid block type',
  'invalid length/literal',
  'invalid distance',
  'stream finished',
  'no stream handler',,
  'no callback',
  'invalid UTF-8 data',
  'extra field too long',
  'date not in range 1980-2099',
  'filename too long',
  'stream finishing',
  'invalid zip data',
  // determined by unknown compression method
]
function err(ind, msg, nt) {
  const e = new Error(msg || ec[ind])
  e.code = ind
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err)
  if (!nt)
    throw e
  return e
}
// expands raw DEFLATE data
function inflt(dat, st, buf, dict) {
  // source length       dict length
  const sl = dat.length
  const dl = dict ? dict.length : 0
  if (!sl || (st.f && !st.l))
    return buf || new u8(0)
  // have to estimate size
  const noBuf = !buf || st.i != 2
  // no state
  const noSt = st.i
  // Assumes roughly 33% compression ratio average
  if (!buf)
    buf = new u8(sl * 3)
  // ensure buffer can fit at least l elements
  const cbuf = function (l) {
    const bl = buf.length
    // need to increase size to fit
    if (l > bl) {
      // Double or set to necessary, whichever is greater
      const nbuf = new u8(Math.max(bl * 2, l))
      nbuf.set(buf)
      buf = nbuf
    }
  }
  //  last chunk         bitpos           bytes
  let final = st.f || 0
  let pos = st.p || 0
  let bt = st.b || 0
  let lm = st.l
  let dm = st.d
  let lbt = st.m
  let dbt = st.n
  // total bits
  const tbts = sl * 8
  do {
    if (!lm) {
      // BFINAL - this is only 1 when last chunk is next
      final = bits(dat, pos, 1)
      // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
      const type = bits(dat, pos + 1, 3)
      pos += 3
      if (!type) {
        // go to end of byte boundary
        var s = shft(pos) + 4
        const l = dat[s - 4] | (dat[s - 3] << 8)
        const t = s + l
        if (t > sl) {
          if (noSt)
            err(0)
          break
        }
        // ensure size
        if (noBuf)
          cbuf(bt + l)
        // Copy over uncompressed data
        buf.set(dat.subarray(s, t), bt)
        // Get new bitpos, update byte count
        ;(st.b = bt += l), (st.p = pos = t * 8), (st.f = final)
        continue
      }
      else if (type == 1) {
        (lm = flrm), (dm = fdrm), (lbt = 9), (dbt = 5)
      }
      else if (type == 2) {
        //  literal                            lengths
        const hLit = bits(dat, pos, 31) + 257
        const hcLen = bits(dat, pos + 10, 15) + 4
        const tl = hLit + bits(dat, pos + 5, 31) + 1
        pos += 14
        // length+distance tree
        const ldt = new u8(tl)
        // code length tree
        const clt = new u8(19)
        for (var i = 0; i < hcLen; ++i) {
          // use index map to get real code
          clt[clim[i]] = bits(dat, pos + i * 3, 7)
        }
        pos += hcLen * 3
        // code lengths bits
        const clb = max(clt)
        const clbmsk = (1 << clb) - 1
        // code lengths map
        const clm = hMap(clt, clb, 1)
        for (var i = 0; i < tl;) {
          const r = clm[bits(dat, pos, clbmsk)]
          // bits read
          pos += r & 15
          // symbol
          var s = r >> 4
          // code length to copy
          if (s < 16) {
            ldt[i++] = s
          }
          else {
            //  copy   count
            var c = 0
            let n = 0
            if (s == 16)
              (n = 3 + bits(dat, pos, 3)), (pos += 2), (c = ldt[i - 1])
            else if (s == 17)
              (n = 3 + bits(dat, pos, 7)), (pos += 3)
            else if (s == 18)
              (n = 11 + bits(dat, pos, 127)), (pos += 7)
            while (n--) ldt[i++] = c
          }
        }
        //    length tree                 distance tree
        const lt = ldt.subarray(0, hLit)
        var dt = ldt.subarray(hLit)
        // max length bits
        lbt = max(lt)
        // max dist bits
        dbt = max(dt)
        lm = hMap(lt, lbt, 1)
        dm = hMap(dt, dbt, 1)
      }
      else {
        err(1)
      }
      if (pos > tbts) {
        if (noSt)
          err(0)
        break
      }
    }
    // Make sure the buffer can hold this + the largest possible addition
    // Maximum chunk size (practically, theoretically infinite) is 2^17
    if (noBuf)
      cbuf(bt + 131072)
    const lms = (1 << lbt) - 1
    const dms = (1 << dbt) - 1
    let lpos = pos
    for (; ; lpos = pos) {
      // bits read, code
      var c = lm[bits16(dat, pos) & lms]
      const sym = c >> 4
      pos += c & 15
      if (pos > tbts) {
        if (noSt)
          err(0)
        break
      }
      if (!c)
        err(2)
      if (sym < 256) {
        buf[bt++] = sym
      }
      else if (sym == 256) {
        ;(lpos = pos), (lm = null)
        break
      }
      else {
        let add = sym - 254
        // no extra bits needed if less
        if (sym > 264) {
          // index
          var i = sym - 257
          var b = fleb[i]
          add = bits(dat, pos, (1 << b) - 1) + fl[i]
          pos += b
        }
        // dist
        const d = dm[bits16(dat, pos) & dms]
        const dsym = d >> 4
        if (!d)
          err(3)
        pos += d & 15
        var dt = fd[dsym]
        if (dsym > 3) {
          var b = fdeb[dsym]
          ;(dt += bits16(dat, pos) & ((1 << b) - 1)), (pos += b)
        }
        if (pos > tbts) {
          if (noSt)
            err(0)
          break
        }
        if (noBuf)
          cbuf(bt + 131072)
        const end = bt + add
        if (bt < dt) {
          const shift = dl - dt
          const dend = Math.min(dt, end)
          if (shift + bt < 0)
            err(3)
          for (; bt < dend; ++bt) buf[bt] = dict[shift + bt]
        }
        for (; bt < end; bt += 4) {
          buf[bt] = buf[bt - dt]
          buf[bt + 1] = buf[bt + 1 - dt]
          buf[bt + 2] = buf[bt + 2 - dt]
          buf[bt + 3] = buf[bt + 3 - dt]
        }
        bt = end
      }
    }
    ;(st.l = lm), (st.p = lpos), (st.b = bt), (st.f = final)
    if (lm)
      (final = 1), (st.m = lbt), (st.d = dm), (st.n = dbt)
  } while (!final)
  return bt == buf.length ? buf : slc(buf, 0, bt)
}
// starting at p, write the minimum number of bits that can hold v to d
function wbits(d, p, v) {
  v <<= p & 7
  const o = (p / 8) | 0
  d[o] |= v
  d[o + 1] |= v >> 8
}
// starting at p, write the minimum number of bits (>8) that can hold v to d
function wbits16(d, p, v) {
  v <<= p & 7
  const o = (p / 8) | 0
  d[o] |= v
  d[o + 1] |= v >> 8
  d[o + 2] |= v >> 16
}
// creates code lengths from a frequency table
function hTree(d, mb) {
  // Need extra info to make a tree
  const t = []
  for (var i = 0; i < d.length; ++i) {
    if (d[i])
      t.push({ s: i, f: d[i] })
  }
  const s = t.length
  const t2 = t.slice()
  if (!s)
    return { t: et, l: 0 }
  if (s == 1) {
    const v = new u8(t[0].s + 1)
    v[t[0].s] = 1
    return { t: v, l: 1 }
  }
  t.sort((a, b) => {
    return a.f - b.f
  })
  // after i2 reaches last ind, will be stopped
  // freq must be greater than largest possible number of symbols
  t.push({ s: -1, f: 25001 })
  let l = t[0]
  let r = t[1]
  let i0 = 0
  let i1 = 1
  let i2 = 2
  t[0] = { s: -1, f: l.f + r.f, l, r }
  // efficient algorithm from UZIP.js
  // i0 is lookbehind, i2 is lookahead - after processing two low-freq
  // symbols that combined have high freq, will start processing i2 (high-freq,
  // non-composite) symbols instead
  // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
  while (i1 != s - 1) {
    l = t[t[i0].f < t[i2].f ? i0++ : i2++]
    r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++]
    t[i1++] = { s: -1, f: l.f + r.f, l, r }
  }
  let maxSym = t2[0].s
  for (var i = 1; i < s; ++i) {
    if (t2[i].s > maxSym)
      maxSym = t2[i].s
  }
  // code lengths
  const tr = new u16(maxSym + 1)
  // max bits in tree
  let mbt = ln(t[i1 - 1], tr, 0)
  if (mbt > mb) {
    // more algorithms from UZIP.js
    // TODO: find out how this code works (debt)
    //  ind    debt
    var i = 0
    let dt = 0
    //    left            cost
    const lft = mbt - mb
    const cst = 1 << lft
    t2.sort((a, b) => {
      return tr[b.s] - tr[a.s] || a.f - b.f
    })
    for (; i < s; ++i) {
      const i2_1 = t2[i].s
      if (tr[i2_1] > mb) {
        dt += cst - (1 << (mbt - tr[i2_1]))
        tr[i2_1] = mb
      }
      else {
        break
      }
    }
    dt >>= lft
    while (dt > 0) {
      const i2_2 = t2[i].s
      if (tr[i2_2] < mb)
        dt -= 1 << (mb - tr[i2_2]++ - 1)
      else ++i
    }
    for (; i >= 0 && dt; --i) {
      const i2_3 = t2[i].s
      if (tr[i2_3] == mb) {
        --tr[i2_3]
        ++dt
      }
    }
    mbt = mb
  }
  return { t: new u8(tr), l: mbt }
}
// get the max length and assign length codes
var ln = function (n, l, d) {
  return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : (l[n.s] = d)
}
// length codes generation
function lc(c) {
  let s = c.length
  // Note that the semicolon was intentional
  while (s && !c[--s]);
  const cl = new u16(++s)
  //  ind      num         streak
  let cli = 0
  let cln = c[0]
  let cls = 1
  const w = function (v) {
    cl[cli++] = v
  }
  for (let i = 1; i <= s; ++i) {
    if (c[i] == cln && i != s) {
      ++cls
    }
    else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138) w(32754)
        if (cls > 2) {
          w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305)
          cls = 0
        }
      }
      else if (cls > 3) {
        w(cln), --cls
        for (; cls > 6; cls -= 6) w(8304)
        if (cls > 2)
          w(((cls - 3) << 5) | 8208), (cls = 0)
      }
      while (cls--) w(cln)
      cls = 1
      cln = c[i]
    }
  }
  return { c: cl.subarray(0, cli), n: s }
}
// calculate the length of output from tree, code lengths
function clen(cf, cl) {
  let l = 0
  for (let i = 0; i < cl.length; ++i) l += cf[i] * cl[i]
  return l
}
// writes a fixed block
// returns the new bit pos
function wfblk(out, pos, dat) {
  // no need to write 00 as type: TypedArray defaults to 0
  const s = dat.length
  const o = shft(pos + 2)
  out[o] = s & 255
  out[o + 1] = s >> 8
  out[o + 2] = out[o] ^ 255
  out[o + 3] = out[o + 1] ^ 255
  for (let i = 0; i < s; ++i) out[o + i + 4] = dat[i]
  return (o + 4 + s) * 8
}
// writes a block
function wblk(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
  wbits(out, p++, final)
  ++lf[256]
  const _a = hTree(lf, 15)
  const dlt = _a.t
  const mlb = _a.l
  const _b = hTree(df, 15)
  const ddt = _b.t
  const mdb = _b.l
  const _c = lc(dlt)
  const lclt = _c.c
  const nlc = _c.n
  const _d = lc(ddt)
  const lcdt = _d.c
  const ndc = _d.n
  const lcfreq = new u16(19)
  for (var i = 0; i < lclt.length; ++i) ++lcfreq[lclt[i] & 31]
  for (var i = 0; i < lcdt.length; ++i) ++lcfreq[lcdt[i] & 31]
  const _e = hTree(lcfreq, 7)
  const lct = _e.t
  const mlcb = _e.l
  let nlcc = 19
  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc);
  const flen = (bl + 5) << 3
  const ftlen = clen(lf, flt) + clen(df, fdt) + eb
  const dtlen
    = clen(lf, dlt)
      + clen(df, ddt)
      + eb
      + 14
      + 3 * nlcc
      + clen(lcfreq, lct)
      + 2 * lcfreq[16]
      + 3 * lcfreq[17]
      + 7 * lcfreq[18]
  if (bs >= 0 && flen <= ftlen && flen <= dtlen)
    return wfblk(out, p, dat.subarray(bs, bs + bl))
  let lm, ll, dm, dl
  wbits(out, p, 1 + (dtlen < ftlen)), (p += 2)
  if (dtlen < ftlen) {
    ;(lm = hMap(dlt, mlb, 0)), (ll = dlt), (dm = hMap(ddt, mdb, 0)), (dl = ddt)
    const llm = hMap(lct, mlcb, 0)
    wbits(out, p, nlc - 257)
    wbits(out, p + 5, ndc - 1)
    wbits(out, p + 10, nlcc - 4)
    p += 14
    for (var i = 0; i < nlcc; ++i) wbits(out, p + 3 * i, lct[clim[i]])
    p += 3 * nlcc
    const lcts = [lclt, lcdt]
    for (let it = 0; it < 2; ++it) {
      const clct = lcts[it]
      for (var i = 0; i < clct.length; ++i) {
        var len = clct[i] & 31
        wbits(out, p, llm[len]), (p += lct[len])
        if (len > 15)
          wbits(out, p, (clct[i] >> 5) & 127), (p += clct[i] >> 12)
      }
    }
  }
  else {
    ;(lm = flm), (ll = flt), (dm = fdm), (dl = fdt)
  }
  for (var i = 0; i < li; ++i) {
    const sym = syms[i]
    if (sym > 255) {
      var len = (sym >> 18) & 31
      wbits16(out, p, lm[len + 257]), (p += ll[len + 257])
      if (len > 7)
        wbits(out, p, (sym >> 23) & 31), (p += fleb[len])
      const dst = sym & 31
      wbits16(out, p, dm[dst]), (p += dl[dst])
      if (dst > 3)
        wbits16(out, p, (sym >> 5) & 8191), (p += fdeb[dst])
    }
    else {
      wbits16(out, p, lm[sym]), (p += ll[sym])
    }
  }
  wbits16(out, p, lm[256])
  return p + ll[256]
}
// deflate options (nice << 13) | chain
const deo = /*#__PURE__*/ new i32([
  65540,
  131080,
  131088,
  131104,
  262176,
  1048704,
  1048832,
  2114560,
  2117632,
])
// empty
var et = /*#__PURE__*/ new u8(0)
// compresses data into a raw DEFLATE buffer
function dflt(dat, lvl, plvl, pre, post, st) {
  const s = st.z || dat.length
  const o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7000)) + post)
  // writing to this writes to the output buffer
  const w = o.subarray(pre, o.length - post)
  const lst = st.l
  let pos = (st.r || 0) & 7
  if (lvl) {
    if (pos)
      w[0] = st.r >> 3
    const opt = deo[lvl - 1]
    const n = opt >> 13
    const c = opt & 8191
    const msk_1 = (1 << plvl) - 1
    //    prev 2-byte val map    curr 2-byte val map
    const prev = st.p || new u16(32768)
    const head = st.h || new u16(msk_1 + 1)
    const bs1_1 = Math.ceil(plvl / 3)
    const bs2_1 = 2 * bs1_1
    const hsh = function (i) {
      return (dat[i] ^ (dat[i + 1] << bs1_1) ^ (dat[i + 2] << bs2_1)) & msk_1
    }
    // 24576 is an arbitrary number of maximum symbols per block
    // 424 buffer for last block
    const syms = new i32(25000)
    // length/literal freq   distance freq
    const lf = new u16(288)
    const df = new u16(32)
    //  l/lcnt  exbits  index          l/lind  waitdx          blkpos
    let lc_1 = 0
    let eb = 0
    var i = st.i || 0
    let li = 0
    let wi = st.w || 0
    let bs = 0
    for (; i + 2 < s; ++i) {
      // hash value
      const hv = hsh(i)
      // index mod 32768    previous index mod
      let imod = i & 32767
      let pimod = head[hv]
      prev[imod] = pimod
      head[hv] = imod
      // We always should modify head and prev, but only add symbols if
      // this data is not yet processed ("wait" for wait index)
      if (wi <= i) {
        // bytes remaining
        const rem = s - i
        if ((lc_1 > 7000 || li > 24576) && (rem > 423 || !lst)) {
          pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos)
          ;(li = lc_1 = eb = 0), (bs = i)
          for (var j = 0; j < 286; ++j) lf[j] = 0
          for (var j = 0; j < 30; ++j) df[j] = 0
        }
        //  len    dist   chain
        let l = 2
        let d = 0
        let ch_1 = c
        let dif = (imod - pimod) & 32767
        if (rem > 2 && hv == hsh(i - dif)) {
          const maxn = Math.min(n, rem) - 1
          const maxd = Math.min(32767, i)
          // max possible length
          // not capped at dif because decompressors implement "rolling" index population
          const ml = Math.min(258, rem)
          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i + l] == dat[i + l - dif]) {
              let nl = 0
              for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl);
              if (nl > l) {
                ;(l = nl), (d = dif)
                // break out early when we reach "nice" (we are satisfied enough)
                if (nl > maxn)
                  break
                // now, find the rarest 2-byte sequence within this
                // length of literals and search for that instead.
                // Much faster than just using the start
                const mmd = Math.min(dif, nl - 2)
                let md = 0
                for (var j = 0; j < mmd; ++j) {
                  const ti = (i - dif + j) & 32767
                  const pti = prev[ti]
                  const cd = (ti - pti) & 32767
                  if (cd > md)
                    (md = cd), (pimod = ti)
                }
              }
            }
            // check the previous match
            ;(imod = pimod), (pimod = prev[imod])
            dif += (imod - pimod) & 32767
          }
        }
        // d will be nonzero only when a match was found
        if (d) {
          // store both dist and len data in one int32
          // Make sure this is recognized as a len/dist with 28th bit (2^28)
          syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d]
          const lin = revfl[l] & 31
          const din = revfd[d] & 31
          eb += fleb[lin] + fdeb[din]
          ++lf[257 + lin]
          ++df[din]
          wi = i + l
          ++lc_1
        }
        else {
          syms[li++] = dat[i]
          ++lf[dat[i]]
        }
      }
    }
    for (i = Math.max(i, wi); i < s; ++i) {
      syms[li++] = dat[i]
      ++lf[dat[i]]
    }
    pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos)
    if (!lst) {
      st.r = (pos & 7) | (w[(pos / 8) | 0] << 3)
      // shft(pos) now 1 less if pos & 7 != 0
      pos -= 7
      ;(st.h = head), (st.p = prev), (st.i = i), (st.w = wi)
    }
  }
  else {
    for (var i = st.w || 0; i < s + lst; i += 65535) {
      // end
      let e = i + 65535
      if (e >= s) {
        // write final block
        w[(pos / 8) | 0] = lst
        e = s
      }
      pos = wfblk(w, pos + 1, dat.subarray(i, e))
    }
    st.i = s
  }
  return slc(o, 0, pre + shft(pos) + post)
}
// Adler32
function adler() {
  let a = 1
  let b = 0
  return {
    p(d) {
      // closures have awful performance
      let n = a
      let m = b
      const l = d.length | 0
      for (let i = 0; i != l;) {
        const e = Math.min(i + 2655, l)
        for (; i < e; ++i) m += n += d[i]
        ;(n = (n & 65535) + 15 * (n >> 16)), (m = (m & 65535) + 15 * (m >> 16))
      }
      ;(a = n), (b = m)
    },
    d() {
      ;(a %= 65521), (b %= 65521)
      return ((a & 255) << 24) | ((a & 0xFF00) << 8) | ((b & 255) << 8) | (b >> 8)
    },
  }
}
// deflate with opts
function dopt(dat, opt, pre, post, st) {
  if (!st) {
    st = { l: 1 }
    if (opt.dictionary) {
      const dict = opt.dictionary.subarray(-32768)
      const newDat = new u8(dict.length + dat.length)
      newDat.set(dict)
      newDat.set(dat, dict.length)
      dat = newDat
      st.w = dict.length
    }
  }
  return dflt(
    dat,
    opt.level == null ? 6 : opt.level,
    opt.mem == null
      ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5)
      : 12 + opt.mem,
    pre,
    post,
    st,
  )
}
// write bytes
function wbytes(d, b, v) {
  for (; v; ++b) (d[b] = v), (v >>>= 8)
}
// zlib header
function zlh(c, o) {
  const lv = o.level
  const fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2
  ;(c[0] = 120), (c[1] = (fl << 6) | (o.dictionary && 32))
  c[1] |= 31 - (((c[0] << 8) | c[1]) % 31)
  if (o.dictionary) {
    const h = adler()
    h.p(o.dictionary)
    wbytes(c, 2, h.d())
  }
}
// zlib start
function zls(d, dict) {
  if ((d[0] & 15) != 8 || d[0] >> 4 > 7 || ((d[0] << 8) | d[1]) % 31)
    err(6, 'invalid zlib data')
  if (((d[1] >> 5) & 1) == +!dict)
    err(6, `invalid zlib data: ${d[1] & 32 ? 'need' : 'unexpected'} dictionary`)
  return ((d[1] >> 3) & 4) + 2
}
/**
 * Compress data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @returns The zlib-compressed version of the data
 */
function zlibSync(data, opts) {
  if (!opts)
    opts = {}
  const a = adler()
  a.p(data)
  const d = dopt(data, opts, opts.dictionary ? 6 : 2, 4)
  return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d
}
/**
 * Expands Zlib data
 * @param data The data to decompress
 * @param opts The decompression options
 * @returns The decompressed version of the data
 */
function unzlibSync(data, opts) {
  return inflt(
    data.subarray(zls(data, opts && opts.dictionary), -4),
    { i: 2 },
    opts && opts.out,
    opts && opts.dictionary,
  )
}
// text encoder
const te = typeof TextEncoder != 'undefined' && /*#__PURE__*/ new TextEncoder()
// text decoder
const td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder()
// text decoder stream
let tds = 0
try {
  td.decode(et, { stream: true })
  tds = 1
}
catch (e) {}
// decode UTF8
function dutf8(d) {
  for (let r = '', i = 0; ;) {
    let c = d[i++]
    const eb = (c > 127) + (c > 223) + (c > 239)
    if (i + eb > d.length)
      return { s: r, r: slc(d, i - 1) }
    if (!eb) {
      r += String.fromCharCode(c)
    }
    else if (eb == 3) {
      ;(c
        = (((c & 15) << 18) | ((d[i++] & 63) << 12) | ((d[i++] & 63) << 6) | (d[i++] & 63)) - 65536),
      (r += String.fromCharCode(55296 | (c >> 10), 56320 | (c & 1023)))
    }
    else if (eb & 1) {
      r += String.fromCharCode(((c & 31) << 6) | (d[i++] & 63))
    }
    else {
      r += String.fromCharCode(((c & 15) << 12) | ((d[i++] & 63) << 6) | (d[i++] & 63))
    }
  }
}
/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */
function strToU8(str, latin1) {
  if (latin1) {
    const ar_1 = new u8(str.length)
    for (var i = 0; i < str.length; ++i) ar_1[i] = str.charCodeAt(i)
    return ar_1
  }
  if (te)
    return te.encode(str)
  const l = str.length
  let ar = new u8(str.length + (str.length >> 1))
  let ai = 0
  const w = function (v) {
    ar[ai++] = v
  }
  for (var i = 0; i < l; ++i) {
    if (ai + 5 > ar.length) {
      const n = new u8(ai + 8 + ((l - i) << 1))
      n.set(ar)
      ar = n
    }
    let c = str.charCodeAt(i)
    if (c < 128 || latin1) {
      w(c)
    }
    else if (c < 2048) {
      w(192 | (c >> 6)), w(128 | (c & 63))
    }
    else if (c > 55295 && c < 57344) {
      (c = (65536 + (c & (1023 << 10))) | (str.charCodeAt(++i) & 1023)),
      w(240 | (c >> 18)),
      w(128 | ((c >> 12) & 63)),
      w(128 | ((c >> 6) & 63)),
      w(128 | (c & 63))
    }
    else {
      w(224 | (c >> 12)), w(128 | ((c >> 6) & 63)), w(128 | (c & 63))
    }
  }
  return slc(ar, 0, ai)
}
/**
 * Converts a Uint8Array to a string
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = ''
    for (let i = 0; i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384))
    return r
  }
  else if (td) {
    return td.decode(dat)
  }
  else {
    const _a = dutf8(dat)
    const s = _a.s
    var r = _a.r
    if (r.length)
      err(8)
    return s
  }
}

function debounce(fn, n = 100) {
  let handle
  return (...args) => {
    if (handle)
      clearTimeout(handle)
    handle = setTimeout(() => {
      fn(...args)
    }, n)
  }
}
function utoa(data) {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}
function atou(base64) {
  const binary = atob(base64)
  if (binary.startsWith('xÚ')) {
    const buffer = strToU8(binary, true)
    const unzipped = unzlibSync(buffer)
    return strFromU8(unzipped)
  }
  return decodeURIComponent(escape(binary))
}

export { atou, debounce, utoa }
