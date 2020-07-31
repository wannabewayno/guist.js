testParameters = {};

// ======================== createProgressHash() ==================================
testParameters.createProgressHash = {};
    testParameters.createProgressHash.testValues = [
        [
            {
                name:'thresholdRGB',
                threshold:{
                    upper:255,
                    lower:0,
                    step:1
                }
            },
            {
                name:'thresholdBinary',
                algorithim:'threshold',
                threshold:{
                    upper:1,
                    lower:0,
                    step:0.01
                },
                invert:true,
                useAlpha:true
            }
        ]
    ];
    testParameters.createProgressHash.expected = [
        {
            name:'thresholdRGB',
            reset:false,
            option:{
                threshold:0
            },
            limits:{
                threshold:{
                    upper:255,
                    lower:0,
                    step:1
                }
            }
        },
        {
            name:'thresholdBinary',
            reset:false,
            option:{
                algorithim:'threshold',
                threshold:0,
                invert:true,
                useAlpha:true
            },
            limits:{
                threshold:{
                    upper:1,
                    lower:0,
                    step:0.01
                }
            }
        }
    ];

// ======================================== updateProgress() ====================================
testParameters.updateProgress = {};
    testParameters.updateProgress.testValues = [
        [
            {
                name:'thresholdRGB',
                reset:false,
                option:{
                    threshold:0
                },
                limits:{
                    threshold:{
                        upper:255,
                        lower:0,
                        step:1
                    }
                }
            },
            {
                name:'thresholdBinary',
                reset:false,
                option:{
                    algorithim:'threshold',
                    threshold:0,
                    invert:true,
                    useAlpha:true
                },
                limits:{
                    threshold:{
                        upper:1,
                        lower:0,
                        step:0.01
                    }
                }
            }
        ],
        4
    ]
    testParameters.updateProgress.expected = [
        {
            name:'thresholdRGB',
            reset:false,
            option:{
                threshold:0
            },
            limits:{
                threshold:{
                    upper:255,
                    lower:0,
                    step:1
                }
            }
        },
        {
            name:'thresholdBinary',
            reset:false,
            option:{
                algorithim:'threshold',
                threshold:0.04,
                invert:true,
                useAlpha:true
            },
            limits:{
                threshold:{
                    upper:1,
                    lower:0,
                    step:0.01
                }
            }
        }
    ]
// ======================================== getFilterSequence() ====================================
testParameters.getFilterSequence = {};
testParameters.getFilterSequence.testValues = [
    [
        {
            name:'thresholdRGB',
            reset:false,
            option:{
                threshold:0
            },
            limits:{
                threshold:{
                    upper:255,
                    lower:0,
                    step:1
                }
            }
        },
        {
            name:'thresholdBinary',
            reset:false,
            option:{
                algorithim:'threshold',
                threshold:0.04,
                invert:true,
                useAlpha:true
            },
            limits:{
                threshold:{
                    upper:1,
                    lower:0,
                    step:0.01
                }
            }
        }
    ]
];
testParameters.getFilterSequence.expected = ['thresholdRGB','thresholdBinary']

module.exports = testParameters;