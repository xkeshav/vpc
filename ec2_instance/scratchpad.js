(function() {

    'use strict';

    var ec2;

    var _service = function() {};

    _service.prototype = {

        init: function(formdata, cb) {
            console.info('::init::', arguments[0]);
            var ec2_config = {
                apiVersion: '2016-09-15',
                region: formdata.region,
                accessKeyId: formdata.accessid,
                secretAccessKey: formdata.accesskey
            };
            ec2 = new AWS.EC2(ec2_config);
            cb();
        },

        describeInstances: function(IP) {
            var params = {
                Filters: [{
                    Name: 'ip-address',
                    Values: [IP]
                }]
            };
            var promise = ec2.describeInstances(params).promise();
            return promise;
        },

        createTags: function(resourceID, tags) {
            var params = {
                Resources: [resourceID],
                Tags: tags
            };
            var promise = ec2.createTags(params).promise();
            return promise;
        },

        createInstance: function(imageID, subnetID, securityGroupID, profileArn) {
            console.info('::createInstance::', arguments);
            var KeyPair = "Zymr-KeyPair";
            var params = {
                ImageId: imageID,
                MaxCount: 1,
                MinCount: 1,
                IamInstanceProfile: {
                    Arn: profileArn
                },
                InstanceInitiatedShutdownBehavior: 'stop',
                InstanceType: 'c4.2xlarge',
                KeyName: KeyPair,
                NetworkInterfaces: [{
                    DeleteOnTermination: true,
                    Description: 'Network interface for dedicated on demand instance',
                    DeviceIndex: 0,
                    Groups: [securityGroupID],
                    SubnetId: subnetID
                }]
            };
            var promise = ec2.runInstances(params).promise();
            return promise;
        },

        checkInstanceRunning: function(instanceID) {
            var params = {
                InstanceIds: [instanceID]
            };
            var promise = ec2.waitFor('instanceRunning', params).promise();
            return promise;
        },

        // allocate elastic IP to the VPC for ec2 instances.
        allocateAddress: function() {
            var params = {
                Domain: "vpc"
            };
            var promise = ec2.allocateAddress(params).promise();
            return promise;
        },

        // allocate elastic IP to an EC2 instance
        associateAddress: function(allocationID, instanceID) {
            var params = {
                AllocationId: allocationID,
                InstanceId: instanceID
            };
            var promise = ec2.associateAddress(params).promise();
            return promise;
        }
    };

    window._EC2 = new _service();

}());