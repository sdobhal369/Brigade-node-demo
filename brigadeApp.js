const { events, Job, Group } = require("brigadier");

// Triggers the event

events.on("exec", (e,project) => {

// Job for Installing Application Dependency
  
  var build = new Job("Dependency-Installation");
  
  build.image = "node:alpine";
  
  build.tasks = [
    "cd /src",
    "npm install"
    
  ];
  

// Job for Docker Build & Push
  
  var dockerPack = new Job("docker-Packaging");
  
  dockerPack.image = "docker:dind";
  dockerPack.privileged = true;                              // dind needs to run in privileged mode
  
  dockerPack.env = {
    DOCKER_DRIVER: "overlay",

    DOCKER_USER: project.secrets.dockerLogin,                 // Place these credentials while creating brigade project
    DOCKER_PASS: project.secrets.dockerPass                   // Place these credentials while creating brigade project
  }
    
  dockerPack.tasks = [
    "dockerd-entrypoint.sh &",                                // Start the docker daemon
    "sleep 30",                                               // Grant it enough time to be up and running
    "cd /src",                                                // Go to the project checkout dir
    "docker build -t sdobhal369/boilerplate:latest .",           // Replace with your own image tag
    "docker login -u $DOCKER_USER -p $DOCKER_PASS",      
    "docker push sdobhal369/boilerplate:latest"                  // Replace with your own image tag
  
  ];
  
  
// Job for Deploying Application On Minikube 
  
  var deploy = new Job("deploy-application", "sdobhal369/boilerplate:latest")
  
  deploy.tasks = [
    "cd /src",  
    "kubectl apply -f deploy.yaml"                              // Apply the newly created deploy.yaml file
  
  ];
  
  Group.runEach([build, dockerPack, deploy]);

});
