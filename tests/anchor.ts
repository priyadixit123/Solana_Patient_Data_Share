i  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.HospitalDataShare as anchor.Program<HospitalDataShare>;
  
mport assert from "assert";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PatientDataShare } from "../taget/types/Patient_data_share";
import { assert } from "chai";
import type { HospitalDataShare } from "../target/types/hospital_data_share";
describe ("hospital_data_share", ()=> {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PatientDataShare as Program <PatientDataShare>;

  const hospital = anchor.web3.Keypair.generate();
  const patient = anchor.web3.Keypair.generate();
  const access = anchor.web3.Keypair.generate();

  const hospitalName = "Apollo Hospital";
  const patientName = " Payal Ray";
  const initialRecord = "Patient admintted for fever ";
  const updateRecord = "Patient discharged";


  it(" Registers a hospital", async()=> {
    await program.methods 
    .registerHospital (hospitalName)
    .accounts({
      hospital: hospital.publicKey,
      authority: provider.wallet.publicKey,
      systemProgram : anchor.web3.SystemProgram.programId,
    })
    .signers([hospital])
    .rpc();

    const hospitalAccount = await program.account.hospital.fetch(hospital.publicKey);
    assert.equal(hospitalAccount.name , hospitalName);
    assert.ok(hospitalAccount.authority.equals(provider.wallet.publicKey));
  });

  it ("Registers a patient", async ()=>{
    await program.methods

    .registerPatient(patientName,initialRecord)
    .accounts ({
      patient: patient.publicKey,
      authority: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    
    })
    .signers([patient])
    .rpc();

    const patientAccount = await program.account.patient.fetch(patient.publicKey);
    assert.equal(patientAccount.name, patientName);
    assert.equal(patientAccount.record, initialRecord);

  });

  it("Update patient record", async()=>
  {
    await program.methods
    .updateRecord(updatedRecord)
    .accounts({
      patient: patient.publicKey,
      authority: provider.wallet.publicKey,
    })
    .rpc();

    const updatedPatient = await program.account.patient.fetch (patient.publicKey);
    assert.equal(updatedPatient.record, updatedRecord);
  });

  it("Grants hospital access to patient", async()=> {
    await program.methods
    .grantAccess()
    .accounts ({
      access: access.publicKey,
      hospital: hospital.publicKey,
      patient: patient.publicKey,
      authority: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,

    })

    .signers([access])
    .rpc();

    const accessAccount = await program.account.access.fetch(access.publicKey);

    assert.ok(accessAccount.hospital.equals(hospital.publicKey));
    assert.ok(accessAccount.patient.equals(patient.publicKey));
  });

  it("Revoke Access", async()=>
  {
    await program.methods
    .revokeAccess()
    .accounts({
      access: access.publicKey,
      authority: provider.wallet.publicKey,
    })
    .rpc();
    try{
      await program.access.fetch(access.publicKey);
      assert.fail("Access account should be closed");
    }
    catch (err) 
    {
      assert.ok("Access revoked and account closed");
    }
  });
});