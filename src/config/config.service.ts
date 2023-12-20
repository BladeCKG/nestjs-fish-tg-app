import * as dotenv from 'dotenv';

export class ConfigService {
    private readonly envConfig: Record<string, string>;
    constructor() {
        const result = dotenv.config();

        if (result.error) {
            this.envConfig = process.env;
        } else {
            this.envConfig = result.parsed;
        }
    }

    public get(key: string): string {
        return this.envConfig[key];
    }

    public async getPortConfig() {
        return this.get('PORT');
    }

    public async getMongoConfig() {
        return {
            uri: 'mongodb://' + this.get('MONGO_USER') + ':' + this.get('MONGO_PASSWORD') + '@' + this.get('MONGO_HOST') + '/' + this.get('MONGO_DATABASE'),
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
    }

    public getTGAppConfig() {
        return {
            api_id: parseInt(this.get('TG_APP_API_ID')),
            api_hash: this.get('TG_APP_API_HASH'),
        };
    }
}
