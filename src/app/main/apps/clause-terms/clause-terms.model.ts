import { FuseUtils } from '@fuse/utils';

export class ClauseTerms
{
    id: string;
    parentId: string;
    nos: string;
    termsName: string;
    createdBy: Number;
    createdAt: string;
    updatedBy: Number;
    updatedAt: string;
    isActive: string;
    isDelete: string;

    /**
     * Constructor
     *
     * @param ClauseTerms
     */
    constructor(ClauseTerms)
    {
        {
            this.id = ClauseTerms.id || FuseUtils.generateGUID();
            this.parentId = ClauseTerms.parentId || '';
            this.nos = ClauseTerms.nos || '';
            this.termsName = ClauseTerms.termsName || '';
            this.createdBy = ClauseTerms.createdBy || '';
            this.createdAt = ClauseTerms.createdAt || '';
            this.updatedBy = ClauseTerms.updatedBy || '';
            this.updatedAt = ClauseTerms.updatedAt || '';
            this.isActive = ClauseTerms.isActive || '';
            this.isDelete = ClauseTerms.isDelete || '';
        }
    }
}