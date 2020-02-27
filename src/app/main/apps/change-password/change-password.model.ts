import { FuseUtils } from '@fuse/utils';

export class ChangePassword
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
    constructor(ChangePassword)
    {
        {
            this.id = ChangePassword.id || FuseUtils.generateGUID();
            this.name = ChangePassword.name || '';
            this.lastName = ChangePassword.lastName || '';
            this.avatar = ChangePassword.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = ChangePassword.nickname || '';
            this.company = ChangePassword.company || '';
            this.jobTitle = ChangePassword.jobTitle || '';
            this.email = ChangePassword.email || '';
            this.phone = ChangePassword.phone || '';
            this.address = ChangePassword.address || '';
            this.birthday = ChangePassword.birthday || '';
            this.notes = ChangePassword.notes || '';
        }
    }


}
