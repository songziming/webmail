/**
 * Created by Ã÷Ñô on 2015/6/29.
 */
var config, db;

config = require('./config');

var junk = [
    '习近平指出，今年5月我们在莫斯科成功会晤，',
    '共同出席卫国战争胜利70周年庆典，',
    '向世界发出维护第二次世界大战胜利成果和国际正义的呼声。',
    '我们商定将丝绸之路经济带建设同欧亚经济联盟建设对接，',
    '重点开展投资、金融、能源、高铁等基础设施建设、航空航天、远东开发等领域合作。',
    '两国政府有关部门正落实我们达成的一系列重要合作共识，',
    '一些新领域合作已经取得实实在在的成果。',
    '习近平强调，中俄两国经济结构互补性强，',
    '合作领域宽，市场空间广阔。,',
    '两国要深化经贸合作，继续大力改善贸易结构，',
    '培育新增长点，加快推进战略性合作项目，打造高质量合作平台。',
    '双方要将上海合作组织作为丝绸之路经济带和欧亚经济联盟对接合作的重要平台，',
    '拓宽两国务实合作空间，带动整个欧亚大陆发展、合作、繁荣。',
    '两国要加强人文交流合作，筹划好中俄媒体交流年活动，',
    '增进两国媒体相互了解和友好合作。',
    '习近平指出，中俄应该继续在上海合作组织中保持高水平战略协作，',
    '共同责成相关机制深化合作，',
    '在打击恐怖主义、禁毒等领域采取有力举措，',
    '维护地区安全，推动上海合作组织为维护本地区各国共同利益发挥更大作用。',
    '习近平强调，中方高度重视即将举行的金砖国家领导人第七次会晤。',
    '我们要坚定信心，加强合作，',
    '共同致力于建设金砖国家更紧密、更全面、更牢固的伙伴关系。',
    '我们赞成金砖国家一致向世界发出维护第二次世界大战胜利成果。',
    '促进世界和平与安全、推动国际关系民主化的积极信号，',
    '巩固金砖国家在完善全球治理、加强多边主义等方面的重要作用。',
    '金砖国家要加强相互经济合作，',
    '加快筹建金砖国家新开发银行和应急储备安排，',
    '携手打造金砖国家利益共同体。',
    '要就2015年后发展议程、气候变化谈判。',
    '国际货币基金组织改革、反恐、网络安全等全球治理重点问题密切协调，',
    '维护新兴市场国家和发展中国家共同利益。',
    '普京表示，很高兴时隔两个月在乌法再次接待习近平主席。',
    '俄中全面战略协作伙伴关系正在深入发展。',
    '双方各领域交流密切，在国际事务中保持积极合作。',
    '俄中经贸关系日益重要。',
    '中国已成为俄罗斯第一大贸易伙伴，',
    '两国金融领域合作进一步发展。',
    '俄方积极参与中方发起的亚洲基础设施投资银行筹建工作。',
    '俄中两国基础设施、能源、航天、高新技术等领域合作稳步推进。',
    '我同习主席今年5月决定开展丝绸之路经济带建设同欧亚经济联盟建设对接合作，',
    '相信将为两国经济合作提供更大动力。',
    '俄中人文交流增进了两国人民相互了解和友谊，',
    '俄方赞同办好两国媒体交流年活动。',
    '普京表示，',
    '俄中可以在上海合作组织和金砖国家框架内开展更加密切的协调，',
    '共同推动上述机制促进成员国团结合作，',
    '在成员国共同关心的问题上发挥重要作用。',
    '两国元首还就共同关心的国际和地区问题交换了意见。',
    '蓬莱市公安局登州派出所民警通过天网工程分析，',
    '仅用时15分钟，',
    '将涉嫌抢夺的犯罪嫌疑人邹某抓获。',
    '7月8日9时许，',
    '蓬莱市公安局登州派出所接到宗某报警称，',
    '他在蓬莱市东关东街行走时，',
    '突然感觉脖颈一阵火辣辣地疼痛，',
    '低头一看，脖颈上佩戴的金项链不见了。',
    '正在困惑之时，',
    '只见一名男子骑摩托车从宗某右后方窜出离开。',
    '民警接警后，立即赶赴现场。',
    '根据宗某的回忆，',
    '民警基本确定犯罪嫌疑人为男性，',
    '体态中等，着白色上衣，骑一辆白色无牌摩托车。',
    '嫌疑人信息确定后，民警立即兵分两路，',
    '一路人马载上受害人对发案区域200米范围内进行查看辨认；',
    '另一方面，立即通知所内视频巡侦人员，',
    '对嫌疑人进行查找定位。',
    '几分钟后，',
    '视频组传来消息，已成功锁定嫌疑人逃犯路线，',
    '并基本确定嫌疑人目前身在蓬莱市某小区西出口处。',
    '获知情况后，民警立即驱车赶赴现场，',
    '将正要逃走的犯罪嫌疑人邹某抓获。',
    '从接警到抓获嫌疑人前后不到15分钟，',
    '蓬莱市公安局登州派出所民警就将嫌疑人抓获。',
    '他们生意很好，',
    '一个小姐被抓后交代，',
    '她从进客人房间脱衣服开始到洗好澡穿好衣服出客人房间，',
    '前后只需要10分钟，',
    '2000块钱就到手了。',
    '昨天，办案民警说，',
    '江南警方成功收网的这起特大网络组织卖淫案，',
    '一共刑拘了14名组织卖淫者，',
    '他们是网上招嫖者，',
    '通过微信、陌陌寻找嫖客，',
    '以及安排小姐上门服务的“鸡头”等。',
    '在金华市区，从高档酒店，到一般商务宾馆，',
    '很多地方都留下了这帮小姐的足迹，涉案嫖客和小姐上千人。',
    '网络招嫖者租了一幢房子开展业务广东省东莞市常平镇某村一幢4层高的漂亮房子，',
    '房子门口装有监控，',
    '房子院落围墙上拉着铁丝网，',
    '房子还有两道防盗门。',
    '这幢豪宅里住的并非商贾大咖，而是一帮年轻的小伙子。',
    '每天，他们对着电脑和手机，',
    '向全国各地的微信用户，发送好友请求以及信息。',
    '他们的微信名叫“妩媚”、“静静”、“小曼”等，',
    '看上去非常女性。',
    '他们发送的微信内容一般都是先生，要小姐吗？',
    '身材好，技术好，服务一流。',
    '6月24日下午，',
    '江南警方组织警力，',
    '在东莞警方配合下，',
    '成功破门进入这个房间，',
    '当场控制孙某等多名网络招嫖者，以及大量电脑、手机等作案工具。',
    '就是他们，',
    '向远在千里之外的金华彭某卖淫团伙发送大量嫖客信息，',
    '让彭某团伙在金华开展卖淫活动。',
    '母亲报警女儿被强迫卖淫',
    '2015年1月2日凌晨2时许，',
    '江南公安分局江南派出所接110指令，',
    '一重庆女子称，',
    '她女儿任某离家未归，',
    '人在金华，',
    '好像被人控制起来，',
    '从事卖淫活动，',
    '希望警方解救。',
    '接警后，江南派出所迅速根据展开调查。',
    '当晚，警方找到任某等人。',
    '任某称，她被男友强迫卖淫。',
    '其实她是自愿的，她故意这么说。',
    '当天晚上，她和这帮人一起唱歌，',
    '被男友打了几耳光，她很委屈，',
    '所以就给家里打电话了。',
    '她母亲接到电话后向我们报警求助。',
    '江南公安分局治安大队副大队长邱凯说。',
    '警方发现他们牵扯一个庞大的网上介嫖群体',
    '介嫖即介绍卖淫嫖娼，',
    '该群体利用微信、陌陌等即时聊天工具广泛发布招嫖信息，',
    '并将谈妥的信息发给各地有合作关系的卖淫团伙上门卖淫，',
    '随后按照约定好的分成方式非法获利。',
    '线上招嫖线下卖淫专案组对该案进行了为期数月深入调查，',
    '数次深入广东、重庆等地调查取证，',
    '终于取得了巨大进展。',
    '嫌疑人彭某交代，',
    '2014年7月左右，',
    '他带女友谭某来到金华，',
    '由网上介嫖人员将谈妥的嫖客信息发给他。',
    '他通过QQ群认识了一帮网络招嫖者。',
    '客人在哪个宾馆哪个房间。',
    '一次或包夜价格多少。',
    '招嫖者将信息发给彭某，',
    '彭某再直接组织或让罗某、刘某、女友谭某等协助组织者，',
    '从早上10点开始营业到中午饭点，',
    '移动牛肉面馆',
    '已卖出600多碗拉面。',
    '面对这个成绩，',
    '兰州顶乐餐饮服务有限公司总经理赵志强喜笑颜开。',
    '他告诉记者，',
    '移动牛肉面馆',
    '是兰州顶乐餐饮服务有限公司的一次有意义的实践和创新。',
    '去年在西安的一次展会上，',
    '移动牛肉面馆',
    '一经推出，',
    '就受到了广大消费者的一致好评，',
    '创下了1小时售出1000碗的记录。',
    '鉴于“移动牛肉面馆”流动性强的优势，',
    '这辆车开到哪，',
    '就能将兰州牛肉面这张名片送到哪，',
    '只要支几张餐桌，',
    '放几张板凳，',
    '街边就能变餐馆，',
    '让顾客享用到正宗美味的兰州牛肉面',
    '半个多月前，',
    '浙江杭州余杭警方接到一起摩托车被盗报警，',
    '报警人是星桥派出所辖区内的某小区业主，',
    '刘先生。',
    '原来，刘先生停在小区楼下的一辆摩托车被盗了。',
    '就中午一会功夫，',
    '我上楼半个事情，',
    '这车就不见了。',
    '刘先生说，',
    '他这辆车要毛五千块钱。',
    '到底是谁偷了刘先生的车。',
    '民警迅速赶到现场，',
    '并调取了案发地时间段的监控。',
    '经查看，当天，有一名头戴黑头盔，',
    '身着蓝色雨披，',
    '脚上蹬着一双红鞋子',
    '男子骑着摩托从案发地出来，',
    '经刘先生辨认，',
    '监控显示的摩托车就是他被盗的那一辆。',
    '通过视频追踪，',
    '民警发现，男子一路先从藕花洲大街由西向东往临平方向，',
    '再转向09省道，',
    '沿着临丁路往杭州方向骑行。最后，拐进了杭州下城区某小区。',
    '民警火速赶至该小区，',
    '并在14幢边上的一个车棚里发现被盗的摩托车。',
    '民警决定，埋伏在摩托车边上，',
    '等嫌疑人开车的时候，',
    '来个守株待兔。可是，',
    '一连蹲守了两天，都不见有人来开车。',
    '由于事发时，男子全副武装，',
    '根本看不清正脸。',
    '如果他一直不来取摩托车，',
    '那偌大的小区，几百家住户，',
    '怎么找到这个偷车贼呢。',
    '就在案件陷入僵局之际，',
    '民警在小区监控里又发现了一个细节。',
    '当天，嫌疑人骑车进了小区，',
    '之后不过二十分钟，',
    '一个男子走了出来，',
    '脚上蹬着的是和嫌疑人一样的红鞋子。',
    '这两个人，很有可能是同一人。',
    '民警马上视频截图后，',
    '拿着男子的照片到了社区，',
    '经过邻里辨认，',
    '视频中的男子边上家住14幢3单元某室的盛某。',
    '然而，民警又了解到，',
    '这套房子虽是盛某的，',
    '但已被他租了出去，',
    '并不住在这里。',
    '那盛某怎么还在这个小区进进出出呢？',
    '经调查，原来，',
    '盛某的父亲也住该小区，',
    '就在边上的一幢。'
];

var mails = [
    'lmysoar@hotmail.com',
    'stn121@163.com',
    's.ziming121@gmail.com',
    's.ziming@hotmail.com',
    'wangchunqibuaa@163.com',
    '12211010@buaa.edu.cn',
    'xsf72006@gmail.com',
    'xsf72006@qq.com',
    'xsf72006@163.com',
    'i@wanzy.me',
    'qinbingchen@me.com',
    'renfei.song@gmail.com',
    'milkzhpy@163.com'
];

function rand_sentence() {
    return junk[Math.floor(Math.random()*junk.length)];
}

function rand_para(n) {
    var str = "";
    for (var i = 0; i < n; ++i) {
        str += rand_sentence();
    }
    return str;
}

var gethelper = require('./mail/dbhelper');

var fill_inbox_with_junk = function(db) {
    var Inbox = db.models.inbox;
    global.db = db;
    for (var i = 0; i < 50; ++i) {
        var txt = rand_para(i%5+3)
        Inbox.create({
            title: rand_sentence(),
            text: txt,
            html: txt,
            from: mails[i%mails.length],
            status: 'received'
        });
        // gethelper(
        //     rand_sentence(),
        //     mails[i%mails.length],
        //     txt,
        //     txt);
    }
};

var fill_outbox_with_junk = function(db) {
    var Outbox = db.models.outbox;
    for (var i = 0; i < 50; ++i) {
        var txt = rand_para(i%5+3)+'\r\n\r\n'+rand_para(i%3+4)
        Outbox.create({
            title: rand_sentence(),
            text: txt,
            html: txt,
            to: mails[i%mails.length],
            status: //(i%2==1) ? 'handled' : 'audited'
            'audited'
        });
    }
};

db = require('./database')(config.database.name, config.database.username, config.database.password, config.database.config).sync({
    force: true
}).then (function(db) {
    require('./init')(db);
    return db;
}).then(function(db) {
    fill_inbox_with_junk(db);
    return db;
}).then(function(db) {
    fill_outbox_with_junk(db);
    return db;
}).then(function() {
    console.log('Sync successfully!');
})["catch"](function(err) {
    return console.log(err.message);
});