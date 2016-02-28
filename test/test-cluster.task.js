var CMD = require('../lib/cluster.cmd.js')
    ,CTask = require('../lib/cluster.task.js')
    ,expect = require('expect.js');

describe('测试集群任务', function() {
    describe('集群任务参数', function() {
        before(function(done){
            this.ClusterManager = CTask.ClusterManager();
            done();
        });
        it('无参数', function(done){
            try{
                new CTask.ClusterTask();
            }catch(e){
                try{
                    this.ClusterManager.createTask();
                }catch(e){
                    done();
                }
            }
        });
        it('cmd参数', function(done){
            var task = new CTask.ClusterTask(CMD.TEST);
            expect(task.cmd).to.equal(CMD.TEST);
            expect(typeof task.data).to.equal('undefined');
            expect(typeof task.callback).to.equal('undefined');

            task = this.ClusterManager.createTask(CMD.TEST);
            expect(task.cmd).to.equal(CMD.TEST);
            expect(typeof task.data).to.equal('undefined');
            expect(typeof task.callback).to.equal('undefined');
            done();
        });
        it('cmd,data参数', function(done){
            var task = new CTask.ClusterTask(CMD.TEST,{});
            expect(task.cmd).to.equal(CMD.TEST);
            expect(typeof task.data).to.equal('object');
            expect(typeof task.callback).to.equal('undefined');

            task = this.ClusterManager.createTask(CMD.TEST,{});
            expect(task.cmd).to.equal(CMD.TEST);
            expect(typeof task.data).to.equal('object');
            expect(typeof task.callback).to.equal('undefined');
            done();
        });
        it('cmd,callback参数', function(done){
            var task = new CTask.ClusterTask(CMD.TEST,function(){});
            expect(task.cmd).to.equal(CMD.TEST);
            expect(typeof task.data).to.equal('undefined');
            expect(typeof task.callback).to.equal('function');

            task = this.ClusterManager.createTask(CMD.TEST,function(){});
            expect(task.cmd).to.equal(CMD.TEST);
            expect(typeof task.data).to.equal('undefined');
            expect(typeof task.callback).to.equal('function');
            done();
        });
        it('cmd,data,callback参数', function(done){
            var task = new CTask.ClusterTask(CMD.TEST,{},function(){});
            expect(task.cmd).to.equal(CMD.TEST);
            expect(typeof task.data).to.equal('object');
            expect(typeof task.callback).to.equal('function');

            task = this.ClusterManager.createTask(CMD.TEST,{},function(){});
            expect(task.cmd).to.equal(CMD.TEST);
            expect(typeof task.data).to.equal('object');
            expect(typeof task.callback).to.equal('function');
            done();
        });
    });

    describe('尝试转换为集群任务', function() {
        it('无参数', function(done){
            try{
                CTask.ClusterTask.transformTask();
            }catch(e){
                done();
            }
        });

        it('ClusterTask参数', function(done){
            var task1 = new CTask.ClusterTask(CMD.TEST);
            var task2 = CTask.ClusterTask.transformTask(task1);
            expect(task1).to.equal(task2);
            done();
        });

        it('{}参数', function(done){
            try{
                CTask.ClusterTask.transformTask({});
            }catch(e){
                done();
            }
        });

        it('{id}作为参数', function(done){
            try{
                CTask.ClusterTask.transformTask({id:Date.now()});
            }catch(e){
                done();
            }
        });

        it('{cmd}作为参数', function(done){
            var task = CTask.ClusterTask.transformTask({cmd:CMD.TEST});
            expect(task.cmd).to.equal(CMD.TEST);
            expect(typeof task.data).to.equal('undefined');
            expect(typeof task.callback).to.equal('undefined');
            done();
        });

        it('{id,cmd}作为参数', function(done){
            var id = Date.now();
            var task = CTask.ClusterTask.transformTask({id:id,cmd:CMD.TEST});
            expect(task.id).to.equal(id);
            expect(task.cmd).to.equal(CMD.TEST);
            expect(typeof task.data).to.equal('undefined');
            expect(typeof task.callback).to.equal('undefined');
            done();
        });

        it('{id,cmd,data}作为参数', function(done){
            var id = Date.now();
            var task = CTask.ClusterTask.transformTask({id:id,cmd:CMD.TEST,data:{}});
            expect(task.id).to.equal(id);
            expect(task.cmd).to.equal(CMD.TEST);
            expect(typeof task.data).to.equal('object');
            expect(typeof task.callback).to.equal('undefined');
            done();
        });

        it('{id,cmd,callback}作为参数', function(done){
            var id = Date.now();
            var task = CTask.ClusterTask.transformTask({id:id,cmd:CMD.TEST,callback:function(){}});
            expect(task.id).to.equal(id);
            expect(task.cmd).to.equal(CMD.TEST);
            expect(typeof task.data).to.equal('undefined');
            expect(typeof task.callback).to.equal('function');
            done();
        });
        it('{id,cmd,data,callback}作为参数', function(done){
            var id = Date.now();
            var task = CTask.ClusterTask.transformTask({id:id,cmd:CMD.TEST,data:{},callback:function(){}});
            expect(task.id).to.equal(id);
            expect(task.cmd).to.equal(CMD.TEST);
            expect(typeof task.data).to.equal('object');
            expect(typeof task.callback).to.equal('function');
            done();
        });
    });
});
