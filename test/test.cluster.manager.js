var CMD = require('../lib/cluster.cmd')
    ,CTask = require('../lib/cluster.task')
    ,CTest = require('./cluster.test.js')
    ,expect = require('expect.js');

describe('cluster task执行', function() {
    describe('one worker', function() {
        var workerNum = 1;
        before(function (done) {
            workerNum = CTest(workerNum);
            this.ClusterManager = CTask.ClusterManager();
            setTimeout(done, 1000);
        });

        it('one task', function (done) {
            var task = new CTask.ClusterTask(CMD.TEST, function (result) {
                expect(result.length).to.equal(workerNum);
                done();
            });
            this.ClusterManager.run(task);
        });

        it('muilt task', function (done) {
            var tasks = [new CTask.ClusterTask(CMD.TEST),new CTask.ClusterTask(CMD.TEST)];
            var cbNum = 0, len = tasks.length;
            for(var i = 0, task; i< len; i++){
                task = tasks[i];
                task.callback = (function(t){
                    return function (result) {
                        //console.log(result);
                        expect(result.length).to.equal(workerNum);
                        expect(result[0]).to.equal(t.id);
                        if(++cbNum >= len){
                            done();
                        }
                    }
                })(task);
                this.ClusterManager.run(task);
            }
        });

        after(function(done){
            CTest.killWorkers();
            done();
        });
    });
    describe('random worker', function() {
        var workerNum = Math.floor(Math.random() * 8);
        before(function (done) {
            workerNum = CTest(workerNum);
            this.ClusterManager = CTask.ClusterManager();
            setTimeout(done, 1000);
        });

        it('one task', function (done) {
            var task = new CTask.ClusterTask(CMD.TEST, function (result) {
                expect(result.length).to.equal(workerNum);
                done();
            });
            this.ClusterManager.run(task);
        });

        it('muilt task', function (done) {
            var cbNum = 0, len = Math.ceil(Math.random() * 100);
            console.log('tasks:'+len);
            for(var i = 0, task; i< len; i++){
                task = new CTask.ClusterTask(CMD.TEST);
                task.callback = (function(t){
                    return function (result) {
                        //console.log(result);
                        expect(result.length).to.equal(workerNum);
                        expect(result[0]).to.equal(t.id);
                        if(++cbNum >= len){
                            done();
                        }
                    }
                })(task);
                this.ClusterManager.run(task);
            }
        });

        after(function(done){
            CTest.killWorkers();
            done();
        });
    });
});