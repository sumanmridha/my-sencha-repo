/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 */
Ext.define('MyApp.view.main.MainView', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.form.Label',
        'Ext.layout.container.VBox',
        'Ext.plugin.Viewport', //This is required even if the IDE says not
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
            html:'<b>---Classic Desktop View---</b>'
        },
        {
            xtype:'label',
            html:'YO!!'
        }
    ]
});
