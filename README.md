## Testing Instructions

[
Download important dependencies if you haven't so: (node.js, npm and docker)

# Download and install Chocolatey:
powershell -c "irm https://community.chocolatey.org/install.ps1|iex"

# Download and install Node.js:
choco install nodejs --version="24.11.0"

# Verify the Node.js version:
node -v # Should print "v24.11.0".

# Verify npm version:
npm -v # Should print "11.6.1".

]
1. Git clone the repository 
2. 'cd <repository_folder>' 
3. 'npm install'
4. Install docker cli (On Windows paste this command to terminal: 'winget install -e --id Docker.DockerDesktop')
6. Pull postgres's latest image (Terminal: docker pull postgres:latest)
7. Create postgres's container 
( docker run -d `
  --name graphqldemo-container
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=1234 `
  -e POSTGRES_DB=graphqldemo `
  -p 5432:5432 `
  postgres:latest )
8. Check container status (docker ps)
9. Create .env file on project root for database url 
( DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase
" )
10. 'npm run dev'
11. Go to address "http://localhost:4000"

