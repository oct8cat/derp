module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            all: {
                src: ['lib/**/*.js', 'test/**/*.js']
            },
            options: {
                jshintrc: '.jshintrc'
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-jshint')
}
