# Banking Microservice

A .NET Core 8.0 banking API microservice with MySQL database support.

## Setup

### Database Configuration

1. Copy `appsettings.Development.json.example` to `appsettings.Development.json`
2. Update the connection string with your actual database credentials
3. Or set environment variables:
   - `ConnectionStrings__DefaultConnection`

### Environment Variables

The application supports Kubernetes-style environment variables for database configuration:

```bash
export MYSQL_HOST=your-database-host
export MYSQL_PORT=3306
export MYSQL_DB=bankingapp
export MYSQL_USER=your-username
export MYSQL_PWD=your-password
```

Alternatively, you can override the connection string directly:

```bash
export ConnectionStrings__DefaultConnection="Server=your-host;Port=3306;Database=bankingapp;User=your-user;Password=your-password;SslMode=Required;"
```

**Note:** When using Kubernetes environment variables, SSL mode is automatically set to `Required` for security.

The application expects these environment variables in containerized environments:
- `MYSQL_HOST` - MySQL server hostname
- `MYSQL_PORT` - MySQL server port (defaults to 3306)
- `MYSQL_DB` - Database name
- `MYSQL_USER` - Database username
- `MYSQL_PWD` - Database password

### Running the Application

```bash
dotnet restore
dotnet build
dotnet run
```

The API will be available at: http://localhost:8080
Swagger UI: http://localhost:8080/swagger

## Database Schema

The application automatically creates the required database schema on startup using `setup.sql`.

## API Endpoints

- `POST /users/{userId}/accounts` - Create bank account
- `GET /users/{userId}/accounts` - List bank accounts
- `DELETE /users/{userId}/accounts/{id}` - Delete bank account
- `POST /users/{userId}/transactions` - Make transaction
- `GET /users/{userId}/transactions` - List transactions

## Security Note

Never commit database credentials to version control. Use environment-specific configuration files or environment variables.
