node {
    def app
    stage('Clone repository') {
        git 'https://github.com/rosa2070/HowIsTheWeatherToday2.git'
    }
    stage('Build image') {
        app = docker.build("rosa2070/prbasedtest")
    }
    stage('Test image') {
        app.inside {
            sh 'make test'
        }
    }
    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
        }
    }
}
