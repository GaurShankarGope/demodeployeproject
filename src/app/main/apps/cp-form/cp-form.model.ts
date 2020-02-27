import { FuseUtils } from '@fuse/utils';

export class CPFORM
{
    id: string;
    cpformName: string;
    createdBy: Number;
    createdAt: string;
    updatedBy: Number;
    updatedAt: string;
    isActive: string;
    isDelete: string;

    /**
     * Constructor
     *
     * @param CPFORM
     */
    constructor(CPFORM)
    {
        {
            this.id = CPFORM.id || FuseUtils.generateGUID();
            this.cpformName = CPFORM.cpformName || '';
            this.createdBy = CPFORM.createdBy || '';
            this.createdAt = CPFORM.createdAt || '';
            this.updatedBy = CPFORM.updatedBy || '';
            this.updatedAt = CPFORM.updatedAt || '';
            this.isActive = CPFORM.isActive || '';
            this.isDelete = CPFORM.isDelete || '';
        }
    }
}