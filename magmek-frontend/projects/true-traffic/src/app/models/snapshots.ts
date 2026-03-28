import { isArray, isString } from 'lodash';

export class SlVector {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    constructor(init?: Partial<SlVector>) {
        if(init != null) {
            Object.assign(this, init);
        }
    }

    public toString(): string {
        return `<${this.x},${this.y},${this.z}>`;
    }
}

export class AvatarSnapshot {
    public language: string = 'en';
    public position: SlVector = new SlVector();
    public name: string = '';
    public ts: number = 0;
    public birth_date: Date = new Date(Date.now());
    public id: string = '';
    public sim_id: string = '';

    constructor(init?: Partial<AvatarSnapshot>) {
        if (init != null) {
            Object.assign(this, init);
            this.position = new SlVector(init.position);
            if (isString(init.birth_date)) {
                this.birth_date = new Date(init.birth_date);
            }
        }
    }
}

export class Avatar {
    public name: string = '';
    public birth_date: Date = new Date(Date.now());
    public user_id: string = '';

    constructor(init?: Partial<Avatar>) {
        if(init != null) {
            Object.assign(this, init);
            if (isString(init.birth_date)) {
                this.birth_date = new Date(init.birth_date);
            }
        }
    }
}

export class Sim {
    public sim_pos: SlVector = new SlVector();
    public sim_name: string = '';
    public grid_name: string = '';

    constructor(init?: Partial<Sim>) {
        if (init != null) {
            Object.assign(this, init);
            this.sim_pos = new SlVector(init.sim_pos);
        }
    }
}

export class SimSnapshot {
    public sim_pos: SlVector = new SlVector();
    public sim_status: string = '';
    public sim_rating: string = '';
    public sim_name: string = '';
    public ts: number = 0;
    public agent_count: number = 0;
    public agent_limit: number = 0;
    public agent_limit_max: number = 0;
    public agent_reserved: number = 0;
    public agent_unreserved: number = 0;
    public dynamic_pathfinding: string = '';
    public estate_id: number = 0;
    public estate_name: string = '';
    public frame_number: number = 0;
    public region_cpu_ratio: number = 0;
    public region_idle: number = 0;
    public region_product_name: string = '';
    public region_product_sku: string = '';
    public region_start_time: number = 0;
    public sim_channel: string = '';
    public sim_version: string = '';
    public simulator_hostname: string = '';
    public region_max_prims: number = 0;
    public region_object_bonus: number = 0;
    public whisper_range: number = 0;
    public chat_range: number = 0;
    public shout_range: number = 0;
    public grid: string = '';
    public allow_damage_adjust: boolean = false;
    public restrict_combat_log: boolean = false;
    public restore_health: boolean = false;
    public invulnerability_time: number = 0;
    public damage_throttle: number = 0;
    public health_regen_rate: number = 0;
    public death_action: number = 0;
    public damage_limit: number = 0;
    public avatars: AvatarSnapshot[] = [];

    constructor(init?: Partial<SimSnapshot>) {
        if (init != null) {
            Object.assign(this, init);
            if (isArray(init.avatars)) {
                this.avatars = init.avatars?.map(avSnap => {
                    return new AvatarSnapshot(avSnap);
                });
            }
        }
    }
}
