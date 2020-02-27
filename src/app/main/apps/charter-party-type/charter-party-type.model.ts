import { FuseUtils } from '@fuse/utils';

export class CharterPartyType
{
    id: string;
    name: string;
    createdBy: Number;
    createdAt: string;
    updatedBy: Number;
    updatedAt: string;
    isActive: string;
    isDelete: string;

    /**
     * Constructor
     *
     * @param CharterPartyType
     */
    constructor(CharterPartyType)
    {
        {
            this.id = CharterPartyType.id || FuseUtils.generateGUID();
            this.name = CharterPartyType.name || '';
            this.createdBy = CharterPartyType.createdBy || '';
            this.createdAt = CharterPartyType.createdAt || '';
            this.updatedBy = CharterPartyType.updatedBy || '';
            this.updatedAt = CharterPartyType.updatedAt || '';
            this.isActive = CharterPartyType.isActive || '';
            this.isDelete = CharterPartyType.isDelete || '';
        }
    }
}