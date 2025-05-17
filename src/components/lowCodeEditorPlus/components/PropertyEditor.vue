<template>
  <div class="property-editor">
    <div v-if="selectedComponent" class="editor-content">
      <div class="component-header">
        <h3 class="text-lg font-medium">
          {{ selectedComponent.name }}
          <span class="component-id">{{ selectedComponent.id }}</span>
        </h3>
      </div>

      <el-tabs>
        <!-- Properties Tab -->
        <el-tab-pane label="Properties">
          <div class="property-section">
            <template v-for="(value, key) in selectedComponent.props" :key="key">
              <div class="property-field">
                <label class="property-label">{{ formatPropName(key) }}</label>
                
                <!-- Render different input types based on property type -->
                <template v-if="typeof value === 'boolean'">
                  <el-switch v-model="propValues[key]" @change="updateProp(key, $event)" />
                </template>
                
                <template v-else-if="typeof value === 'number'">
                  <el-input-number v-model="propValues[key]" @change="updateProp(key, $event)" />
                </template>
                
                <template v-else-if="typeof value === 'string'">
                  <el-input v-model="propValues[key]" @change="updateProp(key, $event)" />
                </template>
                
                <template v-else-if="Array.isArray(value)">
                  <div class="array-property">
                    <div v-for="(item, index) in propValues[key]" :key="index" class="array-item">
                      <el-input v-model="propValues[key][index]" @change="updateProp(key, propValues[key])" />
                      <el-button size="small" type="danger" @click="removeArrayItem(key, index)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                    <el-button size="small" type="primary" @click="addArrayItem(key)">
                      Add Item
                    </el-button>
                  </div>
                </template>
                
                <template v-else-if="typeof value === 'object' && value !== null">
                  <div class="object-property">
                    <el-collapse>
                      <el-collapse-item :title="formatPropName(key)">
                        <div v-for="(subValue, subKey) in value" :key="subKey" class="nested-property">
                          <label class="property-label">{{ formatPropName(subKey) }}</label>
                          <el-input 
                            v-model="propValues[key][subKey]" 
                            @change="updateNestedProp(key, subKey, $event)" 
                          />
                        </div>
                      </el-collapse-item>
                    </el-collapse>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </el-tab-pane>

        <!-- Styles Tab -->
        <el-tab-pane label="Styles">
          <div class="style-section">
            <!-- Dimensions -->
            <div class="style-group">
              <h4>Dimensions</h4>
              <div class="style-row">
                <div class="style-field">
                  <label>Width</label>
                  <el-input v-model="styleValues.width" @change="updateStyle('width', $event)" />
                </div>
                <div class="style-field">
                  <label>Height</label>
                  <el-input v-model="styleValues.height" @change="updateStyle('height', $event)" />
                </div>
              </div>
            </div>

            <!-- Spacing -->
            <div class="style-group">
              <h4>Spacing</h4>
              <div class="style-row">
                <div class="style-field">
                  <label>Margin</label>
                  <el-input v-model="styleValues.margin" @change="updateStyle('margin', $event)" />
                </div>
                <div class="style-field">
                  <label>Padding</label>
                  <el-input v-model="styleValues.padding" @change="updateStyle('padding', $event)" />
                </div>
              </div>
            </div>

            <!-- Colors -->
            <div class="style-group">
              <h4>Colors</h4>
              <div class="style-row">
                <div class="style-field">
                  <label>Background</label>
                  <el-color-picker v-model="styleValues.backgroundColor" @change="updateStyle('backgroundColor', $event)" />
                </div>
                <div class="style-field">
                  <label>Text Color</label>
                  <el-color-picker v-model="styleValues.color" @change="updateStyle('color', $event)" />
                </div>
              </div>
            </div>

            <!-- Border -->
            <div class="style-group">
              <h4>Border</h4>
              <div class="style-row">
                <div class="style-field">
                  <label>Border Style</label>
                  <el-select v-model="styleValues.borderStyle" @change="updateStyle('borderStyle', $event)">
                    <el-option value="none" label="None" />
                    <el-option value="solid" label="Solid" />
                    <el-option value="dashed" label="Dashed" />
                    <el-option value="dotted" label="Dotted" />
                  </el-select>
                </div>
                <div class="style-field">
                  <label>Border Width</label>
                  <el-input v-model="styleValues.borderWidth" @change="updateStyle('borderWidth', $event)" />
                </div>
              </div>
              <div class="style-row">
                <div class="style-field">
                  <label>Border Color</label>
                  <el-color-picker v-model="styleValues.borderColor" @change="updateStyle('borderColor', $event)" />
                </div>
                <div class="style-field">
                  <label>Border Radius</label>
                  <el-input v-model="styleValues.borderRadius" @change="updateStyle('borderRadius', $event)" />
                </div>
              </div>
            </div>

            <!-- Text -->
            <div class="style-group">
              <h4>Text</h4>
              <div class="style-row">
                <div class="style-field">
                  <label>Font Size</label>
                  <el-input v-model="styleValues.fontSize" @change="updateStyle('fontSize', $event)" />
                </div>
                <div class="style-field">
                  <label>Font Weight</label>
                  <el-select v-model="styleValues.fontWeight" @change="updateStyle('fontWeight', $event)">
                    <el-option value="normal" label="Normal" />
                    <el-option value="bold" label="Bold" />
                    <el-option value="lighter" label="Lighter" />
                    <el-option value="bolder" label="Bolder" />
                  </el-select>
                </div>
              </div>
              <div class="style-row">
                <div class="style-field">
                  <label>Text Align</label>
                  <el-select v-model="styleValues.textAlign" @change="updateStyle('textAlign', $event)">
                    <el-option value="left" label="Left" />
                    <el-option value="center" label="Center" />
                    <el-option value="right" label="Right" />
                    <el-option value="justify" label="Justify" />
                  </el-select>
                </div>
                <div class="style-field">
                  <label>Line Height</label>
                  <el-input v-model="styleValues.lineHeight" @change="updateStyle('lineHeight', $event)" />
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- Events Tab -->
        <el-tab-pane label="Events">
          <div class="events-section">
            <div class="event-field" v-for="(handler, event) in selectedComponent.events" :key="event">
              <label class="event-label">{{ formatEventName(event) }}</label>
              <el-input
                type="textarea"
                v-model="eventValues[event]"
                @change="updateEvent(event, $event)"
                placeholder="JavaScript code..."
                rows="3"
              />
            </div>

            <div class="add-event">
              <el-button type="primary" @click="showAddEventDialog = true">Add Event Handler</el-button>
            </div>
          </div>
        </el-tab-pane>

        <!-- Component Hierarchy Tab -->
        <el-tab-pane label="Hierarchy">
          <div class="hierarchy-section">
            <el-tree
              :data="componentTree"
              node-key="id"
              :default-expanded-keys="[selectedComponent.id]"
              :current-node-key="selectedComponent.id"
              @node-click="selectTreeNode"
            >
              <template #default="{ node, data }">
                <span class="hierarchy-node">
                  <el-icon><component :is="getComponentIcon(data.type)" /></el-icon>
                  <span>{{ data.name }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-else class="no-selection">
      <el-empty description="No component selected" />
    </div>

    <!-- Add Event Dialog -->
    <el-dialog v-model="showAddEventDialog" title="Add Event Handler" width="500px">
      <div class="add-event-form">
        <el-form>
          <el-form-item label="Event Name">
            <el-select v-model="newEvent.name" placeholder="Select event" style="width: 100%">
              <el-option v-for="event in availableEvents" :key="event" :value="event" :label="formatEventName(event)" />
            </el-select>
          </el-form-item>
          <el-form-item label="Event Handler">
            <el-input
              type="textarea"
              v-model="newEvent.handler"
              placeholder="JavaScript code..."
              rows="4"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddEventDialog = false">Cancel</el-button>
          <el-button type="primary" @click="addEvent">Add Event</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * Property editor for editing component properties, styles, and events
 */
import { ref, computed, watch, reactive } from 'vue';
import { Delete, Document, Edit, Operation, View } from '@element-plus/icons-vue';
import { useEditorStore } from '../store/editorStore';
import type { ComponentInstance } from '../types';

// Store
const editorStore = useEditorStore();

// UI state
const showAddEventDialog = ref(false);
const newEvent = reactive({
  name: '',
  handler: '',
});

// Local copies of component values
const propValues = ref<Record<string, any>>({});
const styleValues = ref<Record<string, any>>({});
const eventValues = ref<Record<string, string>>({});

// Available events
const availableEvents = [
  'click',
  'change',
  'input',
  'focus',
  'blur',
  'mouseenter',
  'mouseleave',
  'submit',
];

// Get the selected component
const selectedComponent = computed<ComponentInstance | null>(() => {
  return editorStore.selectedComponent;
});

// Initialize values when selected component changes
watch(selectedComponent, (newComponent) => {
  try {
    if (newComponent) {
      // Clone props to avoid direct mutation
      propValues.value = JSON.parse(JSON.stringify(newComponent.props || {}));
      styleValues.value = JSON.parse(JSON.stringify(newComponent.style || {}));
      eventValues.value = JSON.parse(JSON.stringify(newComponent.events || {}));
    } else {
      propValues.value = {};
      styleValues.value = {};
      eventValues.value = {};
    }
  } catch (error) {
    console.error('Error initializing property values:', error);
  }
}, { immediate: true });

// Format property name for display
const formatPropName = (name: string): string => {
  try {
    return name
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  } catch (error) {
    console.error('Error formatting property name:', error);
    return name;
  }
};

// Format event name for display
const formatEventName = (name: string): string => {
  try {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  } catch (error) {
    console.error('Error formatting event name:', error);
    return name;
  }
};

/**
 * Update component property
 */
const updateProp = (key: string, value: any) => {
  try {
    if (!selectedComponent.value) return;
    
    const updatedProps = {
      ...selectedComponent.value.props,
      [key]: value,
    };
    
    editorStore.updateComponent(selectedComponent.value.id, {
      props: updatedProps,
    });
  } catch (error) {
    console.error(`Error updating property ${key}:`, error);
  }
};

/**
 * Update nested property
 */
const updateNestedProp = (key: string, subKey: string, value: any) => {
  try {
    if (!selectedComponent.value) return;
    
    const updatedObj = {
      ...selectedComponent.value.props[key],
      [subKey]: value,
    };
    
    const updatedProps = {
      ...selectedComponent.value.props,
      [key]: updatedObj,
    };
    
    editorStore.updateComponent(selectedComponent.value.id, {
      props: updatedProps,
    });
  } catch (error) {
    console.error(`Error updating nested property ${key}.${subKey}:`, error);
  }
};

/**
 * Update style property
 */
const updateStyle = (key: string, value: any) => {
  try {
    if (!selectedComponent.value) return;
    
    const updatedStyles = {
      ...selectedComponent.value.style,
      [key]: value,
    };
    
    editorStore.updateComponent(selectedComponent.value.id, {
      style: updatedStyles,
    });
  } catch (error) {
    console.error(`Error updating style ${key}:`, error);
  }
};

/**
 * Update event handler
 */
const updateEvent = (event: string, handler: string) => {
  try {
    if (!selectedComponent.value) return;
    
    const updatedEvents = {
      ...selectedComponent.value.events,
      [event]: handler,
    };
    
    editorStore.updateComponent(selectedComponent.value.id, {
      events: updatedEvents,
    });
  } catch (error) {
    console.error(`Error updating event ${event}:`, error);
  }
};

/**
 * Add a new array item to a property
 */
const addArrayItem = (key: string) => {
  try {
    if (!selectedComponent.value || !Array.isArray(selectedComponent.value.props[key])) return;
    
    const updatedArray = [...propValues.value[key], ''];
    propValues.value[key] = updatedArray;
    
    updateProp(key, updatedArray);
  } catch (error) {
    console.error(`Error adding array item to ${key}:`, error);
  }
};

/**
 * Remove an array item from a property
 */
const removeArrayItem = (key: string, index: number) => {
  try {
    if (!selectedComponent.value || !Array.isArray(selectedComponent.value.props[key])) return;
    
    const updatedArray = [...propValues.value[key]];
    updatedArray.splice(index, 1);
    propValues.value[key] = updatedArray;
    
    updateProp(key, updatedArray);
  } catch (error) {
    console.error(`Error removing array item from ${key} at index ${index}:`, error);
  }
};

/**
 * Add a new event handler
 */
const addEvent = () => {
  try {
    if (!selectedComponent.value || !newEvent.name) return;
    
    const updatedEvents = {
      ...selectedComponent.value.events,
      [newEvent.name]: newEvent.handler,
    };
    
    editorStore.updateComponent(selectedComponent.value.id, {
      events: updatedEvents,
    });
    
    eventValues.value[newEvent.name] = newEvent.handler;
    
    // Reset and close dialog
    newEvent.name = '';
    newEvent.handler = '';
    showAddEventDialog.value = false;
  } catch (error) {
    console.error('Error adding event:', error);
  }
};

/**
 * Build component tree for hierarchy view
 */
const componentTree = computed(() => {
  try {
    const buildTree = (components: ComponentInstance[]): any[] => {
      return components.map(comp => ({
        id: comp.id,
        label: comp.name,
        type: comp.type,
        children: comp.children && comp.children.length > 0 ? buildTree(comp.children) : [],
      }));
    };
    
    return buildTree(editorStore.state.components);
  } catch (error) {
    console.error('Error building component tree:', error);
    return [];
  }
});

/**
 * Select a component from the hierarchy tree
 */
const selectTreeNode = (data: any) => {
  try {
    editorStore.selectComponent(data.id);
  } catch (error) {
    console.error('Error selecting tree node:', error);
  }
};

/**
 * Get icon for component type
 */
const getComponentIcon = (type: string) => {
  try {
    if (type.includes('el-button')) return 'Operation';
    if (type.includes('el-input')) return 'Edit';
    if (type.includes('chart') || type.includes('echarts') || type.includes('g2')) return 'View';
    return 'Document';
  } catch (error) {
    console.error('Error getting component icon:', error);
    return 'Document';
  }
};
</script>

<style scoped>
.property-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #f9f9f9;
  border-left: 1px solid #e0e0e0;
}

.editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 1rem;
}

.component-header {
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 12px;
}

.component-id {
  font-size: 0.7rem;
  color: #909399;
  font-weight: normal;
  margin-left: 8px;
}

.property-section,
.style-section,
.events-section,
.hierarchy-section {
  margin-top: 10px;
}

.property-field,
.style-field,
.event-field {
  margin-bottom: 16px;
}

.property-label,
.event-label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.85rem;
  color: #606266;
}

.style-group {
  margin-bottom: 20px;
}

.style-group h4 {
  margin-bottom: 10px;
  padding-bottom: 4px;
  border-bottom: 1px dashed #e0e0e0;
  color: #303133;
}

.style-row {
  display: flex;
  gap: 16px;
}

.style-field {
  flex: 1;
}

.array-property {
  border: 1px solid #e0e0e0;
  padding: 10px;
  border-radius: 4px;
}

.array-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.nested-property {
  margin-bottom: 8px;
}

.no-selection {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5f7fa;
}

.add-event {
  margin-top: 20px;
}

.hierarchy-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hierarchy-node .el-icon {
  font-size: 1rem;
  color: #606266;
}
</style>