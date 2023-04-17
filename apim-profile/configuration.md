# Configuration

### How to configure

Swagger UI accepts configuration parameters in four locations.

From lowest to highest precedence:
- The `swagger-config.yaml` in the project root directory, if it exists, is baked into the application
- configuration object passed as an argument to Swagger UI (`SwaggerUI({ ... })`)
- configuration document fetched from a specified `configUrl`
- configuration items passed as key/value pairs in the URL query string

### Parameters

Parameters with dots in their names are single strings used to organize subordinate parameters, and are not indicative of a nested structure.

For readability, parameters are grouped by category and sorted alphabetically.

Type notations are formatted like so:
- `String=""` means a String type with a default value of `""`.
- `String=["a"*, "b", "c", "d"]` means a String type that can be `a`, `b`, `c`, or `d`, with the `*` indicating that `a` is the default value.



### Docker

If you're using the Docker image, you can also control most of these options with environment variables. Each parameter has its environment variable name noted, if available.

Below are the general guidelines for using the environment variable interface.

##### String variables

Set the value to whatever string you'd like, taking care to escape characters where necessary

Example:

```sh
FILTER="myFilterValue"
LAYOUT="BaseLayout"
```

##### Boolean variables

Set the value to `true` or `false`.

Example:

```sh
DISPLAY_OPERATION_ID="true"
DEEP_LINKING="false"
```

##### Number variables

Set the value to _`n`_, where _n_ is the number you'd like to provide.

Example:

```sh
DEFAULT_MODELS_EXPAND_DEPTH="5"
DEFAULT_MODEL_EXPAND_DEPTH="7"
```

##### Array variables

Set the value to the literal array value you'd like, taking care to escape characters where necessary.

Example:

```sh
SUPPORTED_SUBMIT_METHODS="[\"get\", \"post\"]"
URLS="[ { url: \"https://petstore.swagger.io/v2/swagger.json\", name: \"Petstore\" } ]"
```

##### Object variables

Set the value to the literal object value you'd like, taking care to escape characters where necessary.

Example:

```sh
SPEC="{ \"openapi\": \"3.0.0\" }"
```

### Docker-Compose

#### .env file example encoding
```sh
SUPPORTED_SUBMIT_METHODS=['get', 'post']
URLS=[ { url: 'https://petstore.swagger.io/v2/swagger.json', name: 'Petstore' } ]
```
