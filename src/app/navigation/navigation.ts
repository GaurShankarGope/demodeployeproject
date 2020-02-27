import { FuseNavigation } from '@fuse/types';


var childrenArray = [];
var childrenArrayInfo = {};
childrenArrayInfo["id"] = 'dashboard';
childrenArrayInfo["title"] = 'Dashboard';
childrenArrayInfo["translate"] = 'NAV.DASHBOARDS';
childrenArrayInfo["type"] = 'item';
childrenArrayInfo["icon"] = 'network_check';
childrenArrayInfo["url"] = '/apps/dashboards/analytics';
childrenArray.push(childrenArrayInfo);

console.log(localStorage.getItem('userRoleId'));

if (JSON.parse(localStorage.getItem('userRoleId')) != '7') {



    if (JSON.parse(localStorage.getItem('userRoleId')) == '5') {
        var childrenArrayInfo = {};
        childrenArrayInfo["id"] = 'user';
        childrenArrayInfo["title"] = 'User Management';
        childrenArrayInfo["translate"] = 'NAV.USERMANAGEMENT';
        childrenArrayInfo["type"] = 'item';
        childrenArrayInfo["icon"] = 'person_add';
        childrenArrayInfo["url"] = '/apps/user-management';

        childrenArray.push(childrenArrayInfo);

        var childrenArrayInfo = {};
        childrenArrayInfo["id"] = 'CP Form';
        childrenArrayInfo["title"] = 'CP Form Management';
        childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
        childrenArrayInfo["type"] = 'item';
        childrenArrayInfo["icon"] = 'assignment';
        childrenArrayInfo["url"] = '/apps/cp-form-management';

        childrenArray.push(childrenArrayInfo);

        var childrenArrayInfo = {};
        childrenArrayInfo["id"] = 'Clause Catgegory';
        childrenArrayInfo["title"] = 'Clause Catgegory Management';
        childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
        childrenArrayInfo["type"] = 'item';
        childrenArrayInfo["icon"] = 'blur_linear';
        childrenArrayInfo["url"] = '/apps/clause-category-management';

        childrenArray.push(childrenArrayInfo);

        var childrenArrayInfo = {};
        childrenArrayInfo["id"] = 'Clause Terms';
        childrenArrayInfo["title"] = 'Clause Terms Management';
        childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
        childrenArrayInfo["type"] = 'item';
        childrenArrayInfo["icon"] = 'ballot';
        childrenArrayInfo["url"] = '/apps/clause-terms-management';

        childrenArray.push(childrenArrayInfo);
    }

    if (JSON.parse(localStorage.getItem('userRoleId')) == '3') {
        // var childrenArrayInfo = {};
        //     childrenArrayInfo["id"] = 'charter';
        //     childrenArrayInfo["title"] = 'charter Management';
        //     childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
        //     childrenArrayInfo["type"] = 'item';
        //     childrenArrayInfo["icon"] = 'list_alt';
        //     childrenArrayInfo["url"] = '/apps/charterer-management';

        //     childrenArray.push(childrenArrayInfo);
    
    
        var childrenArrayInfo = {};
        childrenArrayInfo["id"] = 'vessel-management';
        childrenArrayInfo["title"] = 'Vessel Management';
        childrenArrayInfo["translate"] = 'NAV.VESSEL';
        childrenArrayInfo["type"] = 'item';
        childrenArrayInfo["icon"] = 'directions_boat';
        childrenArrayInfo["url"] = '/apps/vessel-management';
    
        childrenArray.push(childrenArrayInfo);
    
    
    }
    if (JSON.parse(localStorage.getItem('userRoleId')) == '6') {
        var childrenArrayInfo = {};
        childrenArrayInfo["id"] = 'vessel-management';
        childrenArrayInfo["title"] = 'Vessel Management';
        childrenArrayInfo["translate"] = 'NAV.VESSEL';
        childrenArrayInfo["type"] = 'item';
        childrenArrayInfo["icon"] = 'directions_boat';
        childrenArrayInfo["url"] = '/apps/vessel-management';
    
        childrenArray.push(childrenArrayInfo);
    
    
    }


    var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'Draw C/P';
    childrenArrayInfo["title"] = 'Draw C/P';
    childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'brush';
    childrenArrayInfo["url"] = '/apps/draw-management';

    childrenArray.push(childrenArrayInfo);


    // var childrenArrayInfo = {};
    //     childrenArrayInfo["id"] = 'STD  Biding ';
    //     childrenArrayInfo["title"] = 'Draw C/P';
    //     childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
    //     childrenArrayInfo["type"] = 'item';
    //     childrenArrayInfo["icon"] = 'StdbidManagementModule';
    //     childrenArrayInfo["url"] = '/apps/bid-management';

    //     childrenArray.push(childrenArrayInfo);


    var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'Trading Platform';
    childrenArrayInfo["title"] = 'Trading Platform';
    childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'merge_type';
    childrenArrayInfo["url"] = '/apps/trading-platform-management';

    childrenArray.push(childrenArrayInfo);


    

    var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'Invited Users';
    childrenArrayInfo["title"] = 'Invited Users Management';
    childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'email';
    childrenArrayInfo["url"] = '/apps/invite';

    childrenArray.push(childrenArrayInfo);

    
    var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'Ownership Transfered';
    childrenArrayInfo["title"] = 'Ownership Transfered Management';
    childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'transfer_within_a_station';
    childrenArrayInfo["url"] = '/apps/ownership';
    childrenArray.push(childrenArrayInfo);

    var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'Share Trade';
    childrenArrayInfo["title"] = 'Share Trade Management';
    childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'share';
    childrenArrayInfo["url"] = '/apps/shareTrade';
    childrenArray.push(childrenArrayInfo);

    var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'Messaging Board';
    childrenArrayInfo["title"] = 'Messaging Board';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'message';
    childrenArrayInfo["url"] = '/apps/messaging-board';

    childrenArray.push(childrenArrayInfo);

    var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'Chat Management';
    childrenArrayInfo["title"] = 'Chat Management';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'chat_bubble';
    childrenArrayInfo["url"] = '/apps/chat-management';
    childrenArray.push(childrenArrayInfo);

    var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'FAQ';
    childrenArrayInfo["title"] = 'FAQ';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'notes';
    childrenArrayInfo["url"] = '/apps/faq-management';
    childrenArray.push(childrenArrayInfo);

    var childrenArrayInfo = {};

    var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'Term';
    childrenArrayInfo["title"] = 'Term';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'speaker_notes';
    childrenArrayInfo["url"] = '/apps/term-management';
    childrenArray.push(childrenArrayInfo);

    var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'contact';
    childrenArrayInfo["title"] = 'User Directory';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'notes';
    childrenArrayInfo["url"] = '/apps/contact';
    childrenArray.push(childrenArrayInfo);



    var childrenArrayInfo = {};
    childrenArrayInfo["id"] = 'Notification';
    childrenArrayInfo["title"] = 'Notification';
    childrenArrayInfo["type"] = 'item';
    childrenArrayInfo["icon"] = 'notifications_active';
    childrenArrayInfo["url"] = '/apps/notification';

    childrenArray.push(childrenArrayInfo);
}
// if (JSON.parse(localStorage.getItem('userRoleId')) == '7'){
// var childrenArrayInfo = {};
//     childrenArrayInfo["id"] = 'Draw C/P';
//     childrenArrayInfo["title"] = 'Draw C/P';
//     childrenArrayInfo["translate"] = 'NAV.CHARTERERMANAGEMENT';
//     childrenArrayInfo["type"] = 'item';
//     childrenArrayInfo["icon"] = 'brush';
//     childrenArrayInfo["url"] = '/apps/draw-management';

//     childrenArray.push(childrenArrayInfo);
// }
export const navigation: FuseNavigation[] =
    [

        {
            id: '',
            title: '',
            translate: 'NAV.APPLICATIONS',
            type: 'group',
            icon: 'apps',
            children: childrenArray
        }
    ];
