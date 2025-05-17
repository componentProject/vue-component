<template>
  <div class="property-panel">
    <div class="panel-header">
      <h3>{{ componentDefinition?.name || 'Properties' }}</h3>
    </div>
    
    <el-tabs v-model="activeTab" class="property-tabs">
      <el-tab-pane label="Properties" name="properties">
        <div class="property-form" v-if="selectedComponent">
          <div 
            v-for="(prop, index) in propsSchema" 
            :key="index"
            class="property-item"
          >
            <div class="property-label">{{ prop.label }}</div>
            
            <!-- String property -->
            <el-input 
              v-if="prop.type === 'string'" 
              v-model="componentProps[prop.name]"
              @change="updateProperty(prop.name, $event)"
            />
            
            <!-- Number property -->
            <el-input-number 
              v-else-if="prop.type === 'number'" 
              v-model="componentProps[prop.name]"
              :min="prop.min"
              :max="prop.max"
              @change="updateProperty(prop.name, $event)"
            />
            
            <!-- Boolean property -->
            <el-switch 
              v-else-if="prop.type === 'boolean'" 
              v-model="componentProps[prop.name]"
              @change="updateProperty(prop.name, $event)"
            />
            
            <!-- Select property -->
            <el-select 
              v-else-if="prop.type === 'select'" 
              v-model="componentProps[prop.name]"
              @change="updateProperty(prop.name, $event)"
            >
              <el-option 
                v-for="option in prop.options" 
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            
            <!-- Color property -->
            <el-color-picker 
              v-else-if="prop.type === 'color'" 
              v-model="componentProps[prop.name]"
              @change="updateProperty(prop.name, $event)"
            />
            
            <!-- Slider property -->
            <el-slider 
              v-else-if="prop.type === 'slider'" 
              v-model="componentProps[prop.name]"
              :min="prop.min"
              :max="prop.max"
              @change="updateProperty(prop.name, $event)"
            />
            
            <!-- Date property -->
            <el-date-picker 
              v-else-if="prop.type === 'date'" 
              v-model="componentProps[prop.name]"
              @change="updateProperty(prop.name, $event)"
            />
          </div>
          
          <div v-if="propsSchema.length === 0" class="no-properties">
            No editable properties for this component
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="Style" name="style">
        <div class="style-form" v-if="selectedComponent">
          <div class="property-item">
            <div class="property-label">Position X</div>
            <el-input-number 
              v-model="componentStyle.left" 
              :min="0"
              @change="updateStyle('left', $event)"
            />
          </div>
          
          <div class="property-item">
            <div class="property-label">Position Y</div>
            <el-input-number 
              v-model="componentStyle.top" 
              :min="0"
              @change="updateStyle('top', $event)"
            />
          </div>
          
          <div class="property-item">
            <div class="property-label">Width</div>
            <el-input-number 
              v-model="componentStyle.width" 
              :min="10"
              @change="updateStyle('width', $event)"
            />
          </div>
          
          <div class="property-item">
            <div class="property-label">Height</div>
            <el-input-number 
              v-model="componentStyle.height" 
              :min="10"
              @change="updateStyle('height', $event)"
            />
          </div>
          
          <div class="property-item">
            <div class="property-label">Z-Index</div>
            <el-input-number 
              v-model="componentStyle.zIndex" 
              :min="1"
              @change="updateStyle('zIndex', $event)"
            />
          </div>
          
          <el-divider content-position="left">Additional Styling</el-divider>
          
          <div class="property-item">
            <div class="property-label">Background Color</div>
            <el-color-picker 
              v-model="componentStyle.backgroundColor" 
              @change="updateStyle('backgroundColor', $event)"
            />
          </div>
          
          <div class="property-item">
            <div class="property-label">Text Color</div>
            <el-color-picker 
              v-model="componentStyle.color" 
              @change="updateStyle('color', $event)"
            />
          </div>
          
          <div class="property-item">
            <div class="property-label">Border</div>
            <el-input 
              v-model="componentStyle.border" 
              placeholder="1px solid #ddd"
              @change="updateStyle('border', $event)"
            />
          </div>
          
          <div class="property-item">
            <div class="property-label">Border Radius</div>
            <el-input 
              v-model="componentStyle.borderRadius" 
              placeholder="4px"
              @change="updateStyle('borderRadius', $event)"
            />
          </div>
          
          <div class="property-item">
            <div class="property-label">Padding</div>
            <el-input 
              v-model="componentStyle.padding" 
              placeholder="8px"
              @change="updateStyle('padding', $event)"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useEditorStore } from '../../store/editor';
import type { PropSchema } from '../../types';

/**
 * Property panel component
 * Displays and allows editing of the selected component's properties
 */
const editorStore = useEditorStore();
const activeTab = ref('properties');

/**
 * Get the selected component
 */
const selectedComponent = computed(() => {
  try {
    return editorStore.selectedComponent;
  } catch (error) {
    console.error('Error getting selected component:', error);
    return null;
  }
});

/**
 * Get the component definition for the selected component
 */
const componentDefinition = computed(() => {
  try {
    if (!selectedComponent.value) return null;
    return editorStore.getComponentDefinition(selectedComponent.value.componentId);
  } catch (error) {
    console.error('Error getting component definition:', error);
    return null;
  }
});

/**
 * Get the property schema for the selected component
 */
const propsSchema = computed<PropSchema[]>(() => {
  try {
    if (!componentDefinition.value) return [];
    return componentDefinition.value.propsSchema || [];
  } catch (error) {
    console.error('Error getting props schema:', error);
    return [];
  }
});

/**
 * Store for component properties (for binding to form)
 */
const componentProps = ref<Record<string, any>>({});

/**
 * Store for component style (for binding to form)
 */
const componentStyle = ref<Record<string, any>>({});

/**
 * Watch for changes in selected component and update local state
 */
watch(selectedComponent, newComponent => {
  try {
    if (newComponent) {
      // Clone the properties to avoid direct mutation
      componentProps.value = { ...newComponent.props };
      componentStyle.value = { ...newComponent.style };
    } else {
      componentProps.value = {};
      componentStyle.value = {};
    }
  } catch (error) {
    console.error('Error in selected component watcher:', error);
  }
}, { immediate: true });

/**
 * Update a component property
 * @param propName Property name
 * @param value New value
 */
const updateProperty = (propName: string, value: any) => {
  try {
    if (!selectedComponent.value) return;
    
    // Create a new props object with the updated property
    const updatedProps = {
      ...componentProps.value,
      [propName]: value
    };
    
    // Update the component in the store
    editorStore.updateComponentProps(selectedComponent.value.id, updatedProps);
  } catch (error) {
    console.error('Error updating property:', error);
  }
};

/**
 * Update a component style property
 * @param styleProp Style property name
 * @param value New value
 */
const updateStyle = (styleProp: string, value: any) => {
  try {
    if (!selectedComponent.value) return;
    
    // Update the component style in the store
    editorStore.updateComponentStyle(selectedComponent.value.id, {
      [styleProp]: value
    });
  } catch (error) {
    console.error('Error updating style:', error);
  }
};
</script>

<style scoped>
.property-panel {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e6e6e6;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #606266;
}

.property-tabs {
  flex: 1;
  padding: 0 16px;
}

.property-form,
.style-form {
  margin-top: 16px;
}

.property-item {
  margin-bottom: 16px;
}

.property-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.no-properties {
  color: #909399;
  text-align: center;
  padding: 20px 0;
  font-style: italic;
}
</style> 