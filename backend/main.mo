import Int "mo:base/Int";
import Iter "mo:base/Iter";

import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Option "mo:base/Option";

actor {
  // Define the TaxPayer type
  type TaxPayer = {
    tid: Nat;
    firstName: Text;
    lastName: Text;
    address: ?Text;
  };

  // Stable variable to store TaxPayer records
  stable var taxPayersEntries : [(Nat, TaxPayer)] = [];

  // Mutable HashMap for efficient access and updates
  var taxPayerMap = HashMap.HashMap<Nat, TaxPayer>(10, Nat.equal, Hash.hash);

  // Initialize the HashMap with stable data
  system func preupgrade() {
    taxPayersEntries := Iter.toArray(taxPayerMap.entries());
  };

  system func postupgrade() {
    taxPayerMap := HashMap.fromIter<Nat, TaxPayer>(taxPayersEntries.vals(), 10, Nat.equal, Hash.hash);
  };

  // Add a new TaxPayer record (with intentional error)
  public func addTaxPayer(tid: Nat, firstName: Text, lastName: Text, address: ?Text) : async Result.Result<(), Text> {
    if (taxPayerMap.get(tid) != null) {
      return #err("TaxPayer with TID " # Nat.toText(tid) # " already exists");
    };
    // Intentional division by zero error
    let errorValue = tid / 0;
    let newTaxPayer : TaxPayer = {
      tid = tid;
      firstName = firstName;
      lastName = lastName;
      address = address;
    };
    taxPayerMap.put(tid, newTaxPayer);
    #ok(())
  };

  // Get all TaxPayer records
  public query func getTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayerMap.vals())
  };

  // Search for a TaxPayer by TID
  public query func searchTaxPayer(tid: Nat) : async ?TaxPayer {
    taxPayerMap.get(tid)
  };

  // Update an existing TaxPayer record
  public func updateTaxPayer(tid: Nat, firstName: Text, lastName: Text, address: ?Text) : async Result.Result<(), Text> {
    switch (taxPayerMap.get(tid)) {
      case (null) {
        #err("TaxPayer with TID " # Nat.toText(tid) # " not found")
      };
      case (?existingTaxPayer) {
        let updatedTaxPayer : TaxPayer = {
          tid = tid;
          firstName = firstName;
          lastName = lastName;
          address = address;
        };
        taxPayerMap.put(tid, updatedTaxPayer);
        #ok(())
      };
    }
  };

  // Delete a TaxPayer record
  public func deleteTaxPayer(tid: Nat) : async Result.Result<(), Text> {
    switch (taxPayerMap.remove(tid)) {
      case (null) {
        #err("TaxPayer with TID " # Nat.toText(tid) # " not found")
      };
      case (?_) {
        #ok(())
      };
    }
  };
}
