
export class ContentfulConfig {
  public space: string;
  public accessToken: string;
  public host: string;
  public secure: boolean;
  public resolveLinks: boolean;
  public agent: string;
  public locale: string;

  public constructor(space: string,
                     accessToken: string,
                     host?: string,
                     secure?: boolean,
                     resolveLinks?: boolean,
                     agent?: string,
                     locale?:string) {
    this.space = space;
    this.accessToken = accessToken;
    this.secure = secure;
    this.host = host || "";
    this.resolveLinks = resolveLinks || true;
    this.agent = agent || "";
    this.locale = locale|| "";

  }

  public getConfigObject(): any {
    return {
      space: this.space,
      accessToken: this.accessToken,
      secure: this.secure,
      host: this.host,
      resolveLinks: this.resolveLinks,
      agent: this.agent,
      locale: this.locale
    };
  }
}
