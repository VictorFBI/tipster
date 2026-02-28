package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"gopkg.in/yaml.v2"
)

// OpenAPIDoc gets OpenAPI specification in JSON format for Swagger UI
func OpenAPIDoc(w http.ResponseWriter, r *http.Request) {
	yamlData, err := os.ReadFile("../../api/openapi.yaml")
	if err != nil {
		http.Error(w, "Failed to read OpenAPI spec: " + err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert YAML to map[interface{}]interface{}
	var data interface{}
	if err := yaml.Unmarshal(yamlData, &data); err != nil {
		http.Error(w, "Failed to parse OpenAPI spec: " + err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert map[interface{}]interface{} to map[string]interface{} recursively
	data = convertToJSONCompatible(data)

	// Convert to JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Failed to convert to JSON: " + err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

// convertToJSONCompatible recursively converts map[interface{}]interface{} to map[string]interface{}
func convertToJSONCompatible(v interface{}) interface{} {
	switch val := v.(type) {
	case map[interface{}]interface{}:
		result := make(map[string]interface{})
		for k, v := range val {
			key := fmt.Sprintf("%v", k)
			result[key] = convertToJSONCompatible(v)
		}
		return result
	case []interface{}:
		result := make([]interface{}, len(val))
		for i, v := range val {
			result[i] = convertToJSONCompatible(v)
		}
		return result
	default:
		return v
	}
}
