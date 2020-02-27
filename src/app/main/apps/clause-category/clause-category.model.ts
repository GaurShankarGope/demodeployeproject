import { FuseUtils } from '@fuse/utils';

export class ClauseCategory
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
     * @param ClauseCategory
     */
    constructor(ClauseCategory)
    {
        {
            this.id = ClauseCategory.id || FuseUtils.generateGUID();
            this.name = ClauseCategory.name || '';
            this.createdBy = ClauseCategory.createdBy || '';
            this.createdAt = ClauseCategory.createdAt || '';
            this.updatedBy = ClauseCategory.updatedBy || '';
            this.updatedAt = ClauseCategory.updatedAt || '';
            this.isActive = ClauseCategory.isActive || '';
            this.isDelete = ClauseCategory.isDelete || '';
        }
    }
}