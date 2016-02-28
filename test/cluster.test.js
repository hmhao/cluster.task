var cluster = require('cluster')
    ,os = require('os')
    ,CMD = require('./../lib/cluster.cmd.js')
    ,CTask = require('./../lib/cluster.task.js');

function ClusterTest(workerNum){
    workerNum = workerNum || os.cpus().length;
    if(cluster.isMaster){
        console.log('master fork worker');
        for (var i = 0; i < workerNum; i++){
            cluster.fork();
        }
    }else if(cluster.isWorker){
        console.log('worker create');
        process.on('message', function (msg) {
            console.log('worker_'+cluster.worker.id+' send back');
            if(msg.cmd == CMD.TEST){
                //执行自定义操作
                if(msg.callback){//需要返回结果
                    var task = CTask.ClusterTask.transformTask({
                        id: msg.id,//返回结果必须task id一致
                        cmd: msg.cmd,//返回结果必须task cmd一致
                        data: msg.id
                    });
                    //console.log(task);
                    process.send(task);
                }
            }
        });
    }
    return workerNum;
}

ClusterTest.killWorkers = function(){
    Object.keys(cluster.workers).forEach(function (id) {
        cluster.workers[id].kill();
    });
};

module.exports = ClusterTest;
