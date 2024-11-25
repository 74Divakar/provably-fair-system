// Function to generate a SHA-256 hash
async function hash(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Simulated server-side logic: Generate a random server seed
const originalServerSeed = "exampleServerSeed12345"; // This would typically be randomly generated
let hashedServerSeed = ""; // The hashed version sent to the user

hash(originalServerSeed).then(hash => {
    hashedServerSeed = hash;
    document.getElementById("server-seed").value = hashedServerSeed;
});

// Function to generate game outcomes
async function generateOutcome(serverSeed, clientSeed, nonce) {
    const input = `${serverSeed}-${clientSeed}-${nonce}`;
    const outcomeHash = await hash(input);
    const hex = outcomeHash.slice(0, 8); // First 8 characters for simplicity
    const number = parseInt(hex, 16); // Convert hex to decimal
    const maxValue = 100; // Example: range 0-99
    return number % maxValue;
}

// Event Listener for "Generate Result" Button
document.getElementById("generate-result").addEventListener("click", async () => {
    const clientSeed = document.getElementById("client-seed").value || "defaultClientSeed";
    const nonce = parseInt(document.getElementById("nonce").value, 10);

    if (!clientSeed || isNaN(nonce)) {
        alert("Please provide a valid client seed and nonce.");
        return;
    }

    const result = await generateOutcome(originalServerSeed, clientSeed, nonce);
    document.getElementById("result").innerText = `Game Result: ${result}`;
});
// Function to verify a game result
document.getElementById("verify-result").addEventListener("click", async () => {
    const serverSeed = document.getElementById("original-server-seed").value;
    const clientSeed = document.getElementById("verify-client-seed").value;
    const nonce = parseInt(document.getElementById("verify-nonce").value, 10);

    if (!serverSeed || !clientSeed || isNaN(nonce)) {
        alert("Please provide all inputs: server seed, client seed, and nonce.");
        return;
    }

    // Generate the outcome using the provided inputs
    const result = await generateOutcome(serverSeed, clientSeed, nonce);
    document.getElementById("verification-result").innerText = `Verified Result: ${result}`;
});


