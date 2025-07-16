# Solana_Patient_Data_Share


 # Hospital patient Data Sharing DApp

A decentralized application built on Solana  using  Anchor  that allows hospitals and patients to securely register, update health records, and manage access permissions on-chain. 

# Live Components

 Smart Contract: Built with Rust + Anchor
 Frontend: ReactJS with Phantom/Solflare wallet support
Access Control: Only patients can update their records
Records: Patient data stored on-chain (demo purposes). 

#  Features
  Hospital Register :  Allows hospital authorities to register on-chain.             
  Patient Register :  Patients can register with a name and medical record.         
  Update Record : Only the patient (authority) can update their medical records.
  Grant Access : Patients can grant hospitals access to view their records.     
  Revoke Access : Patients can revoke hospital access.                   

 

# Program Logic Explained

# `#[program]` - Instructions

# rust
pub fn register_hospital(ctx: Context<RegisterHospital>, name: String) -> Result<()>


Registers a new hospital account with a given name and authority.

# rust
pub fn register_patient(ctx: Context<RegisterPatient>, name: String, record: String) -> Result<()>


Registers a new patient with their initial medical record.

# rust
pub fn update_record(ctx: Context<UpdateRecord>, new_record: String) -> Result<()>


Only the patient authority can call this to update their own record.

# rust
pub fn grant_access(ctx: Context<GrantAccess>) -> Result<()>
 

Allows a patient to grant a hospital access to view their data.

# rust
pub fn revoke_access(ctx: Context<RevokeAccess>) -> Result<()>
 

Removes a hospital’s access to a patient’s data by closing the access account.

 

# Data Structures

# rust
#[account]
pub struct Hospital {
    pub authority: Pubkey,
    pub name: String,
    pub registered_at: i64,
}


# rust
#[account]
pub struct Patient {
    pub authority: Pubkey,
    pub name: String,
    pub record: String,
    pub last_updated: i64,
}


# rust
#[account]
pub struct Access {
    pub patient: Pubkey,
    pub hospital: Pubkey,
    pub granted_at: i64,
}


# Account Constraints

| Syntax                            | Meaning                              |
| --------------------------------- | ------------------------------------ |
| `#[account(init, payer, space)]`  | Initializes a new on-chain account   |
| `#[account(mut)]`                 | Allows modification of account       |
| `#[account(has_one = authority)]` | Ensures caller is authorized (owner) |

 

# Frontend (React + Wallet Adapter)

* Phantom + Solflare Wallet Support
* Tailwind UI for styling
* Forms to register hospitals/patients and update data
* Alerts with success/failure feedback
* Wallet button using `@solana/wallet-adapter-react-ui`

> See `/src/App.tsx` and `idl.json` to connect to the deployed program.



# Local Testing

# Anchor Test File: `hospital-data-share.ts`

# Runs all instructions:

  * Register Hospital
  * Register Patient
  * Update Record
  * Grant & Revoke Access

# bash
anchor test 

# Setup Instructions

# Install Rust & Solana CLI

bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Build & Deploy
# bash
anchor build
anchor deploy

# React Frontend
# bash
cd frontend
npm install
npm start
 

# Folder Structure
 
📁 programs/
  └── hospital_data_share/      # Solana smart contract
📁 tests/
  └── hospital-data-share.ts    # Anchor Mocha tests
📁 frontend/
  └── src/App.tsx               # React UI with wallet connection 

 

#  Security & Privacy

* Data is stored on-chain in plaintext (for demo).
* In production, consider encrypting records or storing via IPFS.
* Only the patient authority can modify their data.
 

 # License

MIT License — free to use with attribution.



 
