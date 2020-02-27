import { FuseUtils } from '@fuse/utils';
export class NotificationManagement
{
    id: string;
    
    fromUserId: string;
    toUserId: string;
    notification: string;
    is_read: string;

    createdBy: Number;
    createdAt: string;
    updatedBy: Number;
    updatedAt: string;
    isActive: string;
    isDelete: string;

    /**
     * Constructor
     *
     * @param NotificationManagement
     */
    constructor(NotificationManagement)
    {
        {
            this.id = NotificationManagement.id || FuseUtils.generateGUID();
            
            this.fromUserId = NotificationManagement.fromUserId || '';
            this.toUserId = NotificationManagement.toUserId || '';
            this.notification = NotificationManagement.notification || '';
            this.is_read = NotificationManagement.is_read || '';
            this.createdBy = NotificationManagement.createdBy || '';
            this.createdAt = NotificationManagement.createdAt || '';
            this.updatedBy = NotificationManagement.updatedBy || '';
            this.updatedAt = NotificationManagement.updatedAt || '';
            this.isActive = NotificationManagement.isActive || '';
            this.isDelete = NotificationManagement.isDelete || '';
        }
    }
}