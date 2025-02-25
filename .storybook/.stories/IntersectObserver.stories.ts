import IntersectObserver from '@/components/IntersectObserver/index.vue'
import './assets/styles/IntersectObserver.scss'

import { ref } from 'vue'
import { ElRow, ElCol, ElForm, ElFormItem, ElSelect, ElOption, ElCheckboxGroup } from 'element-plus'

import type { Meta, StoryFn } from '@storybook/vue3'

const meta: Meta<any> = {
  title: '可视化容器',
  component: IntersectObserver,
  // tags: ['!autodocs'],
  args: {},
  argTypes: {
    isIntersecting: {
      control: 'boolean',
      default: true,
    },
    rootMargin: {
      control: false,
    },
    threshold: {
      control: 'number',
    },
    observers: {
      control: false,
    },
    observerIds: {
      control: false,
    },
  },
}
export default meta

export const intersectObserver: StoryFn = () => ({
  template: `
    <div style="max-height: 400px" class="flex flex-1 overflow-hidden">
      <div class="list">
        <div
          @click="scrollToHandler(item.id)"
          :class="{ active: activeListItem == item.id }"
          class="list-item"
          v-for="item in list"
          :key="item.id">
          <span :class="{ visible: activeListItem == item.id }" class="radio">·</span>
          <span class="content">{{ item.name }}</span>
        </div>
      </div>
      <div id="box" class="flex flex-col flex-1 overflow-hidden">
        <IntersectObserver
          class="flex-1 overflow-auto"
          style="padding-right: 40px"
          :root-margin="[0,0,0.8,0]"
          @get-targets="getTargets"
          @mutate="mutate"
          :observer-ids="[
          'baseInfo',
          'hospitalInfo',
          'inAreaHealth',
          'allergy',
          'price',
          'isolationMark'
        ]">
          <!-- 基本信息 -->
          <el-form :label-width="labelWidth" label-suffix="：" :model="patientBaseInfo">
            <div class="flex-between align-center">
              <div id="baseInfo" class="blue-title">基本信息</div>
              <div>
                <el-button
                  v-if="disabledObj.baseInfo"
                  type="primary"
                  @click="editHandler('baseInfo')">
                  编辑
                </el-button>
                <el-button type="primary" v-else @click="saveHandler('baseInfo')">保存</el-button>
                <el-button>刷新</el-button>
              </div>
            </div>
            <!--个人信息-->
            <div>
              <span class="radio-title">
                <span class="radio">·</span>
                <span class="content">个人信息</span>
              </span>
              <el-row class="mt-4">
                <!-- 姓名-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="name" label="姓名">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.name"
                      placeholder="请输入姓名" />
                  </el-form-item>
                </el-col>
                <!-- 年龄,性别 -->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <div class="flex-between align-center">
                    <!-- 年龄 -->
                    <el-form-item prop="age" label="年龄">
                      <el-input
                        :disabled="disabledObj.baseInfo"
                        v-model="patientBaseInfo.age"
                        placeholder="请输入年龄" />
                    </el-form-item>
                    <!-- 性别 -->
                    <el-form-item label-width="60" prop="sex" label="性别">
                      <el-input
                        :disabled="disabledObj.baseInfo"
                        v-model="patientBaseInfo.sex"
                        placeholder="请输入性别" />
                    </el-form-item>
                  </div>
                </el-col>
                <!-- 出生日期-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <!--  出生日期  -->
                  <el-form-item prop="birthday" label="出生日期">
                    <el-date-picker
                      style="width: 100%"
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.birthday"
                      type="date"
                      placeholder="请选择出生日期"
                    />
                  </el-form-item>
                </el-col>
                <!--  证件类别 -->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="idType" label="证件类别">
                    <el-select
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.idType"
                      placeholder="请选择证件类别">
                      <el-option
                        v-for="idType in idTypeOptions"
                        :label="idType.label"
                        :value="idType.value"
                        :key="idType.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!--  证件号码 -->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="idNumber" label="证件号码">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.idNumber"
                      placeholder="请输入证件号码" />
                  </el-form-item>
                </el-col>
                <!--  婚姻状况-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="maritalStatus" label="婚姻状况">
                    <el-select
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.maritalStatus"
                      placeholder="请选择婚姻状况">
                      <el-option
                        v-for="maritalStatus in maritalStatusOptions"
                        :label="maritalStatus.label"
                        :value="maritalStatus.value"
                        :key="maritalStatus.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!--  选择保险类型-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="insuranceType" label="保险类型">
                    <el-select
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.insuranceType"
                      placeholder="请选择保险类型">
                      <el-option
                        v-for="insuranceType in insuranceTypeOptions"
                        :label="insuranceType.label"
                        :value="insuranceType.value"
                        :key="insuranceType.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!--  选择国籍-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="nationality" label="国籍">
                    <el-select
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.nationality">
                      <el-option
                        v-for="nationality in nationalityOptions"
                        :label="nationality.label"
                        :value="nationality.value"
                        :key="nationality.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!--  选择民族-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="nation" label="民族">
                    <el-select :disabled="disabledObj.baseInfo" v-model="patientBaseInfo.nation">
                      <el-option
                        v-for="nation in nationOptions"
                        :label="nation.label"
                        :value="nation.value"
                        :key="nation.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!--  联系电话-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="phone" label="联系电话">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.phone"
                      placeholder="请输入联系电话" />
                  </el-form-item>
                </el-col>
                <!--  健康档案编号-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="healthRecordNumber" label="健康档案编号">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.healthRecordNumber"
                      placeholder="请输入健康档案编号" />
                  </el-form-item>
                </el-col>
                <!--  健康卡号-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="healthCardNumber" label="健康卡号">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.healthCardNumber"
                      placeholder="请输入健康卡号" />
                  </el-form-item>
                </el-col>
                <!--  家庭地址-->
                <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="12">
                  <el-form-item prop="address" label="家庭地址">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.address"
                      placeholder="请输入家庭地址" />
                  </el-form-item>
                </el-col>
                <!--  邮政编码-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="postalCode" label="邮政编码">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.postalCode"
                      placeholder="请输入邮政编码" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <!--工作信息-->
            <div>
              <span class="radio-title">
                <span class="radio">·</span>
                <span class="content">工作信息</span>
              </span>
              <el-row class="mt-4">
                <!--  选择职业类型-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="occupationType" label="职业类型">
                    <el-select
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.occupationType">
                      <el-option
                        v-for="occupationType in occupationTypeOptions"
                        :label="occupationType.label"
                        :value="occupationType.value"
                        :key="occupationType.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 选择工作单位 -->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="workUnit" label="工作单位">
                    <el-select :disabled="disabledObj.baseInfo" v-model="patientBaseInfo.workUnit">
                      <el-option
                        v-for="workUnit in workUnitOptions"
                        :label="workUnit.label"
                        :value="workUnit.value"
                        :key="workUnit.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 单位电话 -->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="workUnitPhone" label="单位电话">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.workUnitPhone"
                      placeholder="请输入单位电话" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <!--  联系人信息-->
            <div>
              <span class="radio-title">
                <span class="radio">·</span>
                <span class="content">联系人信息</span>
              </span>
              <el-row class="mt-4">
                <!-- 联系人 -->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="contactPerson" label="联系人">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.contactPerson"
                      placeholder="请输入联系人" />
                  </el-form-item>
                </el-col>
                <!--  与患者关系-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="contactPersonRelation" label="与患者关系">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.contactPersonRelation"
                      placeholder="请输入与患者关系" />
                  </el-form-item>
                </el-col>
                <!--  电话-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="contactPersonPhone" label="电话">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.contactPersonPhone"
                      placeholder="请输入电话" />
                  </el-form-item>
                </el-col>
                <!--  常住地址-->
                <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="12">
                  <el-form-item prop="contactPersonAddress" label="常住地址">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.contactPersonAddress"
                      placeholder="请输入常住地址" />
                  </el-form-item>
                </el-col>
                <!--邮政编码-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="contactPersonPostalCode" label="邮政编码">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.contactPersonPostalCode"
                      placeholder="请输入邮政编码" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <!--  建档信息-->
            <div>
              <span class="radio-title">
                <span class="radio">·</span>
                <span class="content">建档信息</span>
              </span>
              <el-row class="mt-4">
                <!--  建档时间-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="createTime" label="建档时间">
                    <el-date-picker
                      style="width: 100%"
                      format="YYYY-MM-DD HH:mm:ss"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.createTime"
                      type="date"
                      placeholder="请选择建档时间" />
                  </el-form-item>
                </el-col>
                <!--  建档单位-->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="createUnit" label="建档单位">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.createUnit"
                      placeholder="请输入建档单位" />
                  </el-form-item>
                </el-col>
                <!-- 建档人 -->
                <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                  <el-form-item prop="createUser" label="建档人">
                    <el-input
                      :disabled="disabledObj.baseInfo"
                      v-model="patientBaseInfo.createUser"
                      placeholder="请输入建档人" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <!-- 住院信息 -->
          <el-form :label-width="labelWidth" label-suffix="：" :model="patientHospitalInfo">
            <div class="flex-between align-center">
              <div id="hospitalInfo" class="blue-title">住院信息</div>
              <div>
                <el-button
                  v-if="disabledObj.hospitalInfo"
                  type="primary"
                  @click="editHandler('hospitalInfo')">
                  编辑
                </el-button>
                <el-button type="primary" v-else @click="saveHandler('hospitalInfo')">
                  保存
                </el-button>
                <el-button>刷新</el-button>
              </div>
            </div>
            <el-row class="mt-4">
              <!-- 住院号-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="inHospitalNo" label="住院号">
                  <el-input
                    placeholder="请输入住院号"
                    :disabled="disabledObj.hospitalInfo"
                    v-model="patientBaseInfo.inHospitalNo" />
                </el-form-item>
              </el-col>
              <!-- 入院时间 -->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="inHospitalTime" label="入院时间">
                  <el-date-picker
                    style="width: 100%"
                    :disabled="disabledObj.hospitalInfo"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    v-model="patientBaseInfo.inHospitalTime"
                    placeholder="请选择入院时间" />
                </el-form-item>
              </el-col>
              <!--  入区时间-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="inAreaTime" label="入区时间">
                  <el-date-picker
                    style="width: 100%"
                    :disabled="disabledObj.hospitalInfo"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    v-model="patientBaseInfo.inAreaTime"
                    placeholder="请选择入区时间" />
                </el-form-item>
              </el-col>
              <!--    医疗组-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="medicalGroup" label="医疗组">
                  <el-input
                    placeholder="请输入医疗组"
                    :disabled="disabledObj.hospitalInfo"
                    v-model="patientBaseInfo.medicalGroup" />
                </el-form-item>
              </el-col>
              <!--  责任护士-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="responsibleNurse" label="责任护士">
                  <el-input
                    placeholder="请输入责任护士"
                    :disabled="disabledObj.hospitalInfo"
                    v-model="patientBaseInfo.responsibleNurse" />
                </el-form-item>
              </el-col>
              <!--  经治医生-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="doctor" label="经治医生">
                  <el-input
                    placeholder="请输入经治医生"
                    :disabled="disabledObj.hospitalInfo"
                    v-model="patientBaseInfo.doctor" />
                </el-form-item>
              </el-col>
              <!-- 主治医生-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="chiefDoctor" label="主治医生">
                  <el-input
                    placeholder="请输入主治医生"
                    :disabled="disabledObj.hospitalInfo"
                    v-model="patientBaseInfo.chiefDoctor" />
                </el-form-item>
              </el-col>
              <!--  住院病区-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="inArea" label="住院病区">
                  <el-input
                    placeholder="请输入住院病区"
                    :disabled="disabledObj.hospitalInfo"
                    v-model="patientBaseInfo.inArea" />
                </el-form-item>
              </el-col>
              <!--  住院科室-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="inDepartment" label="住院科室">
                  <el-input
                    placeholder="请输入住院科室"
                    :disabled="disabledObj.hospitalInfo"
                    v-model="patientBaseInfo.inDepartment" />
                </el-form-item>
              </el-col>
              <!--  入院诊断-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="inDiagnosis" label="入院诊断">
                  <el-input
                    placeholder="请输入入院诊断"
                    :disabled="disabledObj.hospitalInfo"
                    v-model="patientBaseInfo.inDiagnosis" />
                </el-form-item>
              </el-col>
              <!--  出院诊断-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="outDiagnosis" label="出院诊断">
                  <el-input
                    placeholder="请输入出院诊断"
                    :disabled="disabledObj.hospitalInfo"
                    v-model="patientBaseInfo.outDiagnosis" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!--  入区健康信息-->
          <el-form :label-width="labelWidth" label-suffix="：" :model="inAreaHealthInfo">
            <div class="flex-between align-center">
              <div id="inAreaHealth" class="blue-title">入区健康信息</div>
              <div>
                <el-button
                  v-if="disabledObj.inAreaHealth"
                  type="primary"
                  @click="editHandler('inAreaHealth')">
                  编辑
                </el-button>
                <el-button type="primary" v-else @click="saveHandler('inAreaHealth')">
                  保存
                </el-button>
                <el-button>刷新</el-button>
              </div>
            </div>
            <el-row>
              <!--    身高-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="height" label="身高">
                  <el-input
                    placeholder="请输入身高"
                    :disabled="disabledObj.inAreaHealth"
                    v-model="inAreaHealthInfo.height" />
                </el-form-item>
              </el-col>
              <!--  体重-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="weight" label="体重">
                  <el-input
                    placeholder="请输入体重"
                    :disabled="disabledObj.inAreaHealth"
                    v-model="inAreaHealthInfo.weight" />
                </el-form-item>
              </el-col>
              <!--  BMI-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="bmi" label="BMI">
                  <el-input
                    placeholder="请输入BMI"
                    :disabled="disabledObj.inAreaHealth"
                    v-model="inAreaHealthInfo.bmi" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!--  血型-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="bloodType" label="血型">
                  <el-input
                    v-model="inAreaHealthInfo.bloodType"
                    :disabled="disabledObj.inAreaHealth"
                    placeholder="请输入血型" />
                </el-form-item>
              </el-col>
              <!--RH血型-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="rhBloodType" label="RH血型">
                  <el-input
                    v-model="inAreaHealthInfo.rhBloodType"
                    :disabled="disabledObj.inAreaHealth"
                    placeholder="请输入RH血型" />
                </el-form-item>
              </el-col>
              <!--  血压-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="bloodPressure" label="血压">
                  <el-input
                    v-model="inAreaHealthInfo.bloodPressure"
                    :disabled="disabledObj.inAreaHealth"
                    placeholder="请输入血压" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!--  呼吸-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="respiratoryRate" label="呼吸">
                  <el-input
                    v-model="inAreaHealthInfo.respiratoryRate"
                    :disabled="disabledObj.inAreaHealth"
                    placeholder="请输入呼吸" />
                </el-form-item>
              </el-col>
              <!--  脉搏-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="pulse" label="脉搏">
                  <el-input
                    v-model="inAreaHealthInfo.pulse"
                    :disabled="disabledObj.inAreaHealth"
                    placeholder="请输入脉搏" />
                </el-form-item>
              </el-col>
              <!--  体温-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="temperature" label="体温">
                  <el-input
                    v-model="inAreaHealthInfo.temperature"
                    :disabled="disabledObj.inAreaHealth"
                    placeholder="请输入体温" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!--  血氧饱和度-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="spo2" label="血氧饱和度">
                  <el-input
                    v-model="inAreaHealthInfo.spo2"
                    :disabled="disabledObj.inAreaHealth"
                    placeholder="请输入血氧饱和度" />
                </el-form-item>
              </el-col>
              <!--  病理状态-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="pathologyStatus" label="病理状态">
                  <el-input
                    v-model="inAreaHealthInfo.pathologyStatus"
                    :disabled="disabledObj.inAreaHealth"
                    placeholder="请输入病理状态" />
                </el-form-item>
              </el-col>
              <!--  生理状态-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="lifeStatus" label="生理状态">
                  <el-input
                    v-model="inAreaHealthInfo.lifeStatus"
                    :disabled="disabledObj.inAreaHealth"
                    placeholder="请输入生理状态" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!--  过敏信息-->
          <div>
            <div class="flex-between align-center">
              <div id="allergy" class="blue-title">过敏信息</div>
              <div>
                <el-button
                  v-if="disabledObj.allergy"
                  type="primary"
                  @click="editHandler('allergy')">
                  编辑
                </el-button>
                <el-button type="primary" v-else @click="saveHandler('allergy')">保存</el-button>
                <el-button>刷新</el-button>
              </div>
            </div>
            <el-table :data="allergyList" border>
              <el-table-column
                v-for="(allergy, index) in allergyColumns"
                v-bind="allergy"
                :key="index">
                <template #default="{ row={}, column={}, $index }={}">
                  <span v-if="disabledObj.allergy">{{ row[column.property] }}</span>
                  <div v-else>
                    <el-date-picker
                      v-if="allergy.type === 'date'"
                      v-model="row[column.property]"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      format="YYYY-MM-DD HH:mm:ss" />
                    <el-input v-else v-model="row[column.property]" placeholder="请输入内容" />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 费用信息 -->
          <el-form :label-width="labelWidth" label-suffix="：" :model="patientPriceInfo">
            <div class="flex-between align-center">
              <div id="price" class="blue-title">费用信息</div>
              <div>
                <el-button>刷新</el-button>
              </div>
            </div>
            <el-row>
              <!--  余额-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="balance" label="余额">
                  <el-input
                    :disabled="disabledObj.price"
                    v-model="patientPriceInfo.balance"
                    placeholder="请输入余额" />
                </el-form-item>
              </el-col>
              <!--  预交金-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="advancePayment" label="预交金">
                  <el-input
                    :disabled="disabledObj.price"
                    v-model="patientPriceInfo.advancePayment"
                    placeholder="请输入预交金" />
                </el-form-item>
              </el-col>
              <!--  费用总额-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="totalCost" label="费用总额">
                  <el-input
                    :disabled="disabledObj.price"
                    v-model="patientPriceInfo.totalCost"
                    placeholder="请输入费用总额" />
                </el-form-item>
              </el-col>
              <!--  担保金-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="guaranteeMoney" label="担保金">
                  <el-input
                    :disabled="disabledObj.price"
                    v-model="patientPriceInfo.guaranteeMoney"
                    placeholder="请输入担保金" />
                </el-form-item>
              </el-col>
              <!--  医保报销-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="medicalInsuranceReimbursement" label="医保报销">
                  <el-input
                    :disabled="disabledObj.price"
                    v-model="patientPriceInfo.medicalInsuranceReimbursement"
                    placeholder="请输入医保报销" />
                </el-form-item>
              </el-col>
              <!--  未结算额-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="unsettledAmount" label="未结算额">
                  <el-input
                    :disabled="disabledObj.price"
                    v-model="patientPriceInfo.unsettledAmount"
                    placeholder="请输入未结算额" />
                </el-form-item>
              </el-col>
              <!--  药品费用-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item label="药品费用">
                  <div class="flex-between width-100">
                    <!--报销比例-->
                    <el-form-item class="flex-1" prop="reimbursementRatio">
                      <el-input
                        :disabled="disabledObj.price"
                        v-model="patientPriceInfo.reimbursementRatio"
                        placeholder="请输入报销比例" />
                    </el-form-item>
                    <!--费用金额-->
                    <el-form-item prop="drugCost">
                      <el-input
                        :disabled="disabledObj.price"
                        v-model="patientPriceInfo.drugCost"
                        placeholder="请输入药品费用" />
                    </el-form-item>
                  </div>
                </el-form-item>
              </el-col>
              <!--  药品费用占比-->
              <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="6">
                <el-form-item prop="drugCostRatio" label="药品费用占比">
                  <el-input
                    :disabled="disabledObj.price"
                    v-model="patientPriceInfo.drugCostRatio"
                    placeholder="请输入药品费用占比" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!--  隔离标识-->
          <div>
            <div class="flex-between align-center">
              <div id="isolationMark" class="blue-title">隔离标识</div>
              <div>
                <el-button
                  v-if="disabledObj.isolationMark"
                  type="primary"
                  @click="editHandler('isolationMark')">
                  编辑
                </el-button>
                <el-button type="primary" v-else @click="saveHandler('isolationMark')">
                  保存
                </el-button>
                <el-button>刷新</el-button>
              </div>
            </div>
            <el-checkbox-group v-model="isolationMark">
              <el-checkbox
                :disabled="disabledObj.isolationMark"
                v-for="mark in markList"
                :key="mark.value"
                :label="mark.label"
                :value="mark.value" />
            </el-checkbox-group>
          </div>
        </IntersectObserver>
      </div>
    </div>
  `,
  components: {
    ElRow,
    ElCol,
    ElSelect,
    ElOption,
    ElForm,
    ElFormItem,
    ElCheckboxGroup,
    IntersectObserver,
  },
  setup() {
    //#region data
    const labelWidth = ref('120px')
    const disabledObj = ref({
      baseInfo: true,
      hospitalInfo: true,
      inAreaHealth: true,
      allergy: true,
      price: true,
      isolationMark: true,
    })
    // 基本信息
    const patientBaseInfo = ref({})
    const idTypeOptions = ref([{ label: '身份证', value: '1' }])
    const maritalStatusOptions = ref([{ label: '已婚', value: '1' }])
    const insuranceTypeOptions = ref([{ label: '医保', value: '1' }])
    const nationalityOptions = ref([{ label: '中国', value: '1' }])
    const nationOptions = ref([{ label: '汉', value: '1' }])
    const occupationTypeOptions = ref([{ label: '测试', value: '1' }])
    const workUnitOptions = ref([{ label: 'trasen', value: '1' }])
    //住院信息
    const patientHospitalInfo = ref({})
    // 入区健康信息
    const inAreaHealthInfo = ref({})
    // 过敏信息
    const allergyColumns = ref<Array<{ label: string; prop: string; type?: string }>>([
      { label: '过敏类型', prop: 'allergyType' },
      { label: '过敏原名称', prop: 'allergyOrigin' },
      { label: '过敏物/过敏药品', prop: 'allergyDrug' },
      { label: '过敏症状', prop: 'allergySymptom' },
      { label: '严重程度', prop: 'allergyDegree' },
      { label: '首次发现时间', prop: 'allergyTime', type: 'date' },
      { label: '首次发现机构', prop: 'firstDiscoverUnit' },
      { label: '记录时间', prop: 'recordTime', type: 'date' },
      { label: '记录人', prop: 'recordName' },
    ])
    const allergyList = ref([
      {
        allergyType: '过敏类型',
        allergyOrigin: '过敏原名称',
        allergyDrug: '过敏物/过敏药品',
        allergySymptom: '过敏症状',
        allergyDegree: '严重程度',
        allergyTime: '首次发现时间',
        firstDiscoverUnit: '首次发现机构',
        recordTime: '记录时间',
        recordName: '记录人',
      },
    ])
    // 费用信息
    const patientPriceInfo = ref({
      drugCostRatio: '',
      drugCost: '',
      reimbursementRatio:'',
      unsettledAmount: '',
      medicalInsuranceReimbursement:'',
      guaranteeMoney:'',
      totalCost:'',
      advancePayment:'',
      balance:'',
      lifeStatus:'',
      pathologyStatus:'',
      spo2:'',
      temperature:'',
      pulse:'',
      respiratoryRate:'',
      bloodPressure:'',
      rhBloodType:'',
      bloodType:'',
      bmi:'',
      outDiagnosis:'',
      inDiagnosis:'',
      inDepartment:'',
      inArea:'',
      chiefDoctor:'',
      doctor:'',
      responsibleNurse:'',
      medicalGroup:'',
      inAreaTime:'',
      inHospitalTime:'',
      inHospitalNo:'',
      createUser:'',
      createUnit:'',
      contactPersonPostalCode:'',
      contactPersonAddress:'',
      contactPersonPhone:'',
      contactPersonRelation:'',
      contactPerson:'',
      workUnitPhone:'',
      workUnit:'',
      occupationType:'',
      healthCardNumber:'',
      healthRecordNumber:'',
      nation:'',
      nationality:'',
      insuranceType:'',
      maritalStatus:'',
      idNumber:'',
      idType:'',
      birthday:'',
    })
    // 隔离标识
    const markList = ref([
      { label: '飞沫隔离', value: '1' },
      { label: '接触隔离', value: '2' },
      { label: '空气隔离', value: '3' },
    ])
    const isolationMark = ref([])

    // list
    const list = ref<{ name: string; id: string; target: Element | null }[]>([
      { name: '基本信息', id: 'baseInfo', target: null },
      { name: '住院信息', id: 'hospitalInfo', target: null },
      { name: '入区健康信息', id: 'inAreaHealth', target: null },
      { name: '过敏信息', id: 'allergy', target: null },
      { name: '费用信息', id: 'price', target: null },
      { name: '隔离标识', id: 'isolationMark', target: null },
    ])
    let timer: undefined | NodeJS.Timeout
    const rootElement = null
    let observer: any, resizeObserver: any
    const hasScroll = ref(false)
    const activeListItem = ref<string>('baseInfo')
    const scrollToHandler = (ref: string) => {
      const findItem: { target: Element | null } | undefined = list.value.find(
        (item) => item.id === ref,
      )
      const element: Element | undefined | null = findItem?.target
      activeListItem.value = ref
      hasScroll.value = true
      clearTimeout(timer)
      timer = setTimeout(() => {
        hasScroll.value = false
      }, 1000)
      element?.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      })
    }
    //#endregion

    //#region methods
    const editHandler = (editKey: string) => {
      disabledObj.value[editKey] = false
    }
    const saveHandler = (saveKey: string) => {
      disabledObj.value[saveKey] = true
    }
    const getTargets = (targets: { target: Element }) => {
      list.value.forEach((item) => {
        item.target = targets[item.id]
      })
    }
    const mutate = (entry: { target: Element }) => {
      const id = entry.target.getAttribute('id')
      if (!hasScroll.value && id) {
        activeListItem.value = id
      }
    }
    //#endregion

    return {
      labelWidth,
      list,
      activeListItem,
      hasScroll,
      disabledObj,
      idTypeOptions,
      nationalityOptions,
      nationOptions,
      maritalStatusOptions,
      occupationTypeOptions,
      insuranceTypeOptions,
      workUnitOptions,
      patientBaseInfo,
      patientHospitalInfo,
      inAreaHealthInfo,
      patientPriceInfo,
      allergyColumns,
      allergyList,
      markList,
      isolationMark,
      rootElement,
      observer,
      resizeObserver,
      scrollToHandler,
      getTargets,
      mutate,
      editHandler,
      saveHandler,
    }
  },
})
intersectObserver.args = {}
