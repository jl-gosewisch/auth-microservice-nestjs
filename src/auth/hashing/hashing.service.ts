import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
    // The salt for the hash function
    private readonly salt = 10;
    // Generate the hash
    async hashPassword( passwort : string ) : Promise<string> {
        return await bcrypt.hash(passwort, this.salt);
    }
    // Compare the hashed passwort
    async comparePassword( passwort: string, hash: string) : Promise<boolean> {
        const result = await bcrypt.compare(passwort, hash);
        return result    
    }
}