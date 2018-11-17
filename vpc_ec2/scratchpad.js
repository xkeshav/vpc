(function() {
    console.log('inside AWSService');

    var _AWSService = function() {
        var ec2, opsworks, elasticbeanstalk;
    };

    _AWSService.prototype = {
        init: function(formdata, cb) {
            var config = {
                apiVersion: '2016-09-15',
                region: 'us-east-1',
                accessKeyId: formdata.accessid,
                secretAccessKey: formdata.accesskey
            };
            ec2 = new AWS.EC2(config);
            opsworks = new AWS.OpsWorks(config);
            elasticbeanstalk = new AWS.ElasticBeanstalk(config);
            cb();
        },

        createStack: function(vpcID, subnetID) {
            var params = {
                DefaultInstanceProfileArn:
                    'arn:aws:iam::902018721894:instance-profile/Admin',
                Name: 'Zero-Test-Stack',
                Region: 'us-east-1',
                ServiceRoleArn: 'arn:aws:iam::902018721894:role/Admin',
                AgentVersion: 'LATEST',
                ChefConfiguration: {
                    BerkshelfVersion: '',
                    ManageBerkshelf: true || false
                },
                DefaultOs: 'Ubuntu 14.04 LTS',
                DefaultSshKeyName: 'Zero-KeyPair',
                DefaultSubnetId: subnetID,
                UseCustomCookbooks: false,
                UseOpsworksSecurityGroups: true,
                VpcId: vpcID
            };
            opsworks.createStack(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        createEnvironment: function() {
            var params = {
                ApplicationName: 'my-app',
                CNAMEPrefix: 'my-app',
                EnvironmentName: 'my-env',
                SolutionStackName:
                    '64bit Amazon Linux 2016.03 v2.1.6 running Java 7',
                VersionLabel: 'v1'
            };
            elasticbeanstalk.createEnvironment(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        cancelSpotFleetRequest: function(spotFleetRequestID) {
            var params = {
                SpotFleetRequestIds: [spotFleetRequestID],
                TerminateInstances: true
            };
            ec2.cancelSpotFleetRequests(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        listAvailableSolutionStacks: function() {
            elasticbeanstalk.listAvailableSolutionStacks(function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data);
            });
        },

        describeSpotInstancesRequests: function(spotInstanceRequestID) {
            var params = {
                SpotInstanceRequestIds: [spotInstanceRequestID]
            };
            ec2.describeSpotInstanceRequests(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        terminateInstances: function(instanceID) {
            var params = {
                InstanceIds: [instanceID]
            };
            ec2.terminateInstances(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        authorizeSecurityGroupIngress: function(securityGroupID) {
            var params = {
                GroupId: securityGroupID,
                IpPermissions: [
                    {
                        FromPort: 8080,
                        IpProtocol: 'tcp',
                        IpRanges: [
                            {
                                CidrIp: '0.0.0.0/0'
                            }
                        ],
                        ToPort: 8080
                    }
                ]
            };
            ec2.authorizeSecurityGroupIngress(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        describeInstances: function(instnaceID) {
            var params = {
                InstanceIds: [instnaceID]
            };
            ec2.describeInstances(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        describeSecurityGroups: function(securityGroupID) {
            var params = {
                GroupIds: [securityGroupID]
            };
            ec2.describeSecurityGroups(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        describeSpotFleetInstances: function(spotFleetRequestID) {
            var params = {
                SpotFleetRequestId: spotFleetRequestID
            };
            ec2.describeSpotFleetInstances(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
            /*
               data = {
                ActiveInstances: [
                 {
                  InstanceId: "i-68665d7e",
                  InstanceType: "m3.medium",
                  SpotInstanceRequestId: "sir-y11i659g"
                 }
                ],
                SpotFleetRequestId: "sfr-a1786e18-7f96-4efb-b7e2-c918e63ef2ec"
               }
               */
        },

        requestSpotFleet: function() {
            var params = {
                SpotFleetRequestConfig: {
                    IamFleetRole:
                        'arn:aws:iam::902018721894:role/aws-ec2-spot-fleet-role',
                    AllocationStrategy: 'lowestPrice',
                    TargetCapacity: 1,
                    SpotPrice: '0.067',
                    ValidFrom: '2016-10-10T05:22:21Z',
                    ValidUntil: '2017-10-10T05:22:21Z',
                    TerminateInstancesWithExpiration: true,
                    LaunchSpecifications: [
                        {
                            ImageId: 'ami-2d39803a',
                            InstanceType: 'm3.medium',
                            KeyName: 'Zero-KeyPair',
                            SpotPrice: '0.067',
                            IamInstanceProfile: {
                                Arn:
                                    'arn:aws:iam::902018721894:instance-profile/Admin'
                            },
                            BlockDeviceMappings: [
                                {
                                    DeviceName: '/dev/sda1',
                                    Ebs: {
                                        DeleteOnTermination: true,
                                        VolumeType: 'gp2',
                                        VolumeSize: 8,
                                        SnapshotId: 'snap-3067152d'
                                    }
                                }
                            ],
                            NetworkInterfaces: [
                                {
                                    DeviceIndex: 0,
                                    SubnetId: 'subnet-7785412c',
                                    DeleteOnTermination: true,
                                    AssociatePublicIpAddress: true,
                                    Groups: ['sg-9f7a56e5']
                                }
                            ]
                        }
                    ],
                    Type: 'request'
                }
            };

            ec2.requestSpotFleet(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
                // Object {SpotFleetRequestId: "sfr-a1786e18-7f96-4efb-b7e2-c918e63ef2ec" }
            });
        },

        createTags: function(resourceID, resourceTag) {
            var params = {
                Resources: [resourceID],
                Tags: [resourceTag]
            };
            ec2.createTags(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        rebootInstances: function(instanceID) {
            var params = {
                InstanceIds: [instanceID]
            };
            ec2.rebootInstances(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        modifyVpcAttribute: function(vpcID) {
            var params = {
                VpcId: vpcID,
                EnableDnsHostnames: {
                    Value: true
                }
            };
            ec2.modifyVpcAttribute(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        describeTags: function() {
            ec2.describeTags({}, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        createRoute: function(routeTableID, internetGatewayID) {
            var params = {
                DestinationCidrBlock: '0.0.0.0/0',
                RouteTableId: routeTableID,
                GatewayId: internetGatewayID
            };
            ec2.createRoute(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        associateRouteTable: function(routeTableID, subnetID) {
            var params = {
                RouteTableId: routeTableID,
                SubnetId: subnetID
            };
            ec2.associateRouteTable(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
                /*
            data = { AssociationId: "rtbassoc-2e49c257" }
          */
            });
        },

        describeRouteTable: function(routeTableID) {
            var params = {
                RouteTableIds: [routeTableID]
            };
            ec2.describeRouteTables(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data);
            });
        },

        createRouteTable: function(vpcID) {
            var params = {
                VpcId: vpcID
            };
            ec2.createRouteTable(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
                /*
                data = {
                 RouteTable: {
                  Associations: [
                  ],
                  PropagatingVgws: [
                  ],
                  RouteTableId: "rtb-be20b2d8",
                  Routes: [
                     {
                    DestinationCidrBlock: "10.0.0.0/16",
                    GatewayId: "local",
                    State: "active"
                   }
                  ],
                  Tags: [
                  ],
                  VpcId: "vpc-0b9aaa6c"
                 }
                }
                */
            });
        },

        createSubnet: function(vpcID) {
            var params = {
                CidrBlock: '10.0.1.0/24',
                VpcId: vpcID
            };
            ec2.createSubnet(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
                /*
                data = {
                 Subnet: {
                  AvailabilityZone: "us-west-1a",
                  AvailableIpAddressCount: 251,
                  CidrBlock: "10.0.1.0/24",
                  State: "pending",
                  SubnetId: "subnet-7785412c",
                  Tags: [],
                  VpcId: "vpc-0b9aaa6c"
                 }
                }
                */
            });
        },

        attachInternetGateway: function(vpcID, internetGatewayID) {
            var params = {
                VpcId: vpcID,
                InternetGatewayId: internetGatewayID
            };
            ec2.attachInternetGateway(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        createInternetGateway: function() {
            ec2.createInternetGateway({}, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
                /*
                data = {
                 InternetGateway: {
                  Attachments: [
                  ],
                  InternetGatewayId: "igw-bdb274da",
                  Tags: [
                  ]
                 }
                }
                */
            });
        },

        describeVpcs: function(vpcID) {
            var params = {
                VpcIds: [vpcID]
            };
            ec2.describeVpcs(params, function(err, data) {
                if (err) console.log(err, err.stack);
                // an error occurred
                else console.log(data); // successful response
            });
        },

        createVPC: function() {
            var params = {
                CidrBlock: '10.0.0.0/16'
            };
            ec2.createVpc(params, function(err, data) {
                if (err) {
                    console.log('Error');
                    console.log(err, err.stack); // an error occurred
                } else {
                    console.log('Success');
                    console.log(data); // successful response

                    /*
                       data = {
                        Vpc: {
                         CidrBlock: "10.0.0.0/16",
                         DhcpOptionsId: "dopt-ee05fc8b",
                         InstanceTenancy: "default",
                         IsDefault: false,
                         State: "pending",
                         VpcId: "vpc-0b9aaa6c"
                        }
                       }
                    */
                }
            });
        }
    };

    // invoke _service as myService in global scope
    window.AWSService = new _AWSService();
})();
