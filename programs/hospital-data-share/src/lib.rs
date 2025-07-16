use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("G56vrhBMCaztx1et4qixXP6rBtZA743GQUDLL867ozSb");

#[program]
mod hospital_data_share {
    use super::*;
    pub fn register_hospital(ctx: Context<RegisterHospital>, name: String) -> Result<()> {
       let hospital = &mut ctx.accounts.hospital;
        hospital.authority = *ctx.accounts.authority.key;
        hospital.name = name;
        hospital.registered_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn update_hospital_info(ctx: Context<UpdateHospitalInfo>, new_name : String) -> Result <()> {
        let hospital = &mut ctx.accounts.hospital;
        hospital.name = new_name;
        Ok(())
    }

    pub fn register_patient(ctx: Context<RegisterPatient>, name: String, record:String) -> Result <()> {
        let patient = &mut ctx.accounts.patient;
        patient.authority = *ctx.accounts.authority.key;
        patient.name = name;
        patient.record = record;
        patient.last_updated = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn update_record(ctx:Context<UpdateRecord>, new_record:String)-> Result<()> {
        let patient = &mut ctx.accounts.patient;
        patient.record = new_record;
        patient.last_updated = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn grant_access(ctx:Context<GrantAccess>) -> Result <()> {
        let access = &mut ctx.accounts.access;
        access.patient = ctx.accounts.patient.key();
        access.hospital = ctx.accounts.hospital.key();
        access.granted_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn revoke_access(ctx:Context<RevokeAccess>) -> Result <()>{
        Ok(())
    }
}

#[derive(Accounts)]
pub struct RegisterHospital<'info> {
     
    #[account(init, payer = authority, space = 8 + 32 + 64 + 8)]
    pub hospital: Account<'info, Hospital>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateHospitalInfo <'info> {
    #[account(mut, has_one = authority)]
    pub hospital : Account<'info, Hospital>,
    pub authority : Signer<'info>,
}

#[derive(Accounts)]
pub struct RegisterPatient <'info> {
    #[account(init, payer = authority, space = 8 + 32+64+1024+8)]
    pub patient: Account<'info, Patient>,
    #[account(mut)]
    pub authority : Signer<'info>,
    pub system_program: Program<'info,System>,
}

#[derive(Accounts)]
pub struct UpdateRecord <'info> {
    #[account(mut, has_one = authority)]
    pub patient : Account<'info, Patient>,
    pub authority : Signer <'info>,
}

#[derive(Accounts)]
pub struct GrantAccess <'info> {
    #[account(init, payer = authority, space = 8+32+32+8)]
    pub access : Account<'info , Access>,
    pub hospital: Account<'info, Hospital>,
    pub patient : Account <'info, Patient>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program : Program<'info, System>,

}

#[derive(Accounts)]
pub struct RevokeAccess<'info> {
    #[account(mut, close = authority)]
    pub access : Account <'info, Access>,
    #[account(mut)]
    pub authority : Signer<'info>,
}

#[account]
pub struct Hospital {
    pub authority : Pubkey,
    pub name : String,
    pub registered_at : i64,
}

#[account]
pub struct Patient {
    pub authority : Pubkey,
    pub name : String,
    pub record : String,
    pub last_updated : i64,
}

#[account]
pub struct Access {
    pub patient : Pubkey,
    pub hospital : Pubkey,
    pub granted_at : i64,
}

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized Access")]
    Unauthorized,
    
}