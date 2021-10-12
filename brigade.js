const { events, Job } = require("brigadier");
events.on("exec", (e,project) => {
  
  var build = new Job("building-stage");
  build.image = "node:9-slim";
  build.tasks = [
    "cd /src",
    "npm install",
    "npm run build"
    
  ];
  
  var dockerPack = new Job("docker-packaging");
  dockerPack.image = "docker:dind";
  dockerPack.privileged = true;
  dockerPack.env = {
    DOCKER_DRIVER: "overlay",
    DOCKER_USER: project.secrets.dockerLogin,
    DOCKER_PASS: project.secrets.dockerPass
  }
    
  dockerPack.tasks = [
    "dockerd-entrypoint.sh &",
    "sleep 30",
    "cd /src",
    "docker build -t sdobhal369/nodeimg:10 .",
    "docker login -u $DOCKER_USER -p $DOCKER_PASS",
    "docker push sdobhal369/nodeimg:10"
  ];
  

build.run().then(() => {
  dockerPack.run()
});

});
