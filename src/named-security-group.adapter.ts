import { ISecurityGroup, SecurityGroup } from "@aws-cdk/aws-ec2";

export interface INamedSecurityGroup extends ISecurityGroup {
  getName(): string;
}

export class NamedSecurityGroup
  extends SecurityGroup
  implements INamedSecurityGroup
{
  public getName(): string {
    return this.securityGroupName;
  }
}
