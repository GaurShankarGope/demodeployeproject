import { FuseUtils } from '@fuse/utils';

export class RoleManagement
{
    id: string;
    name: string;
    lastName: string;
    avatar: string;
    nickname: string;
    company: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    notes: string;
    /**
     * Constructor
     *
     * @param RoleManagement
     */
    constructor(RoleManagement)
    {
        {
            this.id = RoleManagement.id || FuseUtils.generateGUID();
            this.name = RoleManagement.name || '';
            this.lastName = RoleManagement.lastName || '';
            this.avatar = RoleManagement.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = RoleManagement.nickname || '';
            this.company = RoleManagement.company || '';
            this.jobTitle = RoleManagement.jobTitle || '';
            this.email = RoleManagement.email || '';
            this.phone = RoleManagement.phone || '';
            this.address = RoleManagement.address || '';
            this.birthday = RoleManagement.birthday || '';
            this.notes = RoleManagement.notes || '';
        }
    }


}
