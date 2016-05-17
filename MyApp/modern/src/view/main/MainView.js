/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 */
Ext.define('MyApp.view.main.MainView', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',

    requires: [
        'MyApp.view.main.MainViewController',
        'MyApp.view.main.MainViewModel'
    ],

    controller: 'vc-main',
    viewModel: 'vm-main',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    items: [
        {
            xtype:'label',
            html:'<b>---Modern Mobile View---</b>'
        },
        {
            xtype:'label',
            html:'YO!!'
        }
    ]
});
