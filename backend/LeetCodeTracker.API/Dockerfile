# Use .NET 8.0 SDK to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything and restore dependencies
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Use ASP.NET runtime for .NET 8.0
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port (change if needed)
EXPOSE 80
ENTRYPOINT ["dotnet", "LeetCodeTracker.API.dll"]
