/**
 * Upload all card images from assets/cards/ to Pinata IPFS as a folder.
 *
 * Usage:
 *   PINATA_JWT="your_jwt_token" node scripts/upload-to-ipfs.js
 *
 * After upload, call setBaseImageURI("ipfs://<FOLDER_CID>/cards/") on your CardNFT contract.
 * The contract resolves images as: baseImageURI + cardName + ".png"
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PINATA_JWT = process.env.PINATA_JWT;
if (!PINATA_JWT) {
    console.error('ERROR: Set the PINATA_JWT environment variable first.');
    console.error('  Get your JWT from https://app.pinata.cloud/developers/api-keys');
    console.error('  Then run: PINATA_JWT="your_jwt" node scripts/upload-to-ipfs.js');
    process.exit(1);
}

const CARDS_DIR = path.join(__dirname, '..', 'assets', 'cards');

async function main() {
    const files = fs.readdirSync(CARDS_DIR).filter(f => f.endsWith('.png'));
    console.log(`Found ${files.length} card images to upload:\n`);
    files.forEach(f => console.log(`  📄 ${f}`));
    console.log('');

    // Upload all files as a folder using Pinata's pinFileToIPFS with wrapWithDirectory
    console.log('📁 Uploading all card images as an IPFS folder...\n');

    const formData = new FormData();

    for (const filename of files) {
        const filePath = path.join(CARDS_DIR, filename);
        const fileBuffer = fs.readFileSync(filePath);
        const blob = new Blob([fileBuffer], { type: 'image/png' });
        // Use "cards/<filename>" as the path inside the folder
        formData.append('file', blob, `cards/${filename}`);
    }

    formData.append('pinataMetadata', JSON.stringify({ name: 'nft-card-game-images' }));
    formData.append('pinataOptions', JSON.stringify({ wrapWithDirectory: true }));

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: { Authorization: `Bearer ${PINATA_JWT}` },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to upload: ${response.status} ${errorText}`);
        process.exit(1);
    }

    const result = await response.json();
    const folderCID = result.IpfsHash;

    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 SUCCESS! All card images uploaded to IPFS');
    console.log('═══════════════════════════════════════════════════');
    console.log(`\n📁 Folder CID: ${folderCID}`);
    console.log(`🔗 Gateway:    https://gateway.pinata.cloud/ipfs/${folderCID}/cards/`);
    console.log(`\n🔧 Now call setBaseImageURI on your CardNFT contract with:`);
    console.log(`   ipfs://${folderCID}/cards/`);
    console.log(`\n� Or run this Hardhat command to set it on-chain:`);
    console.log(`   npx hardhat console --network localhost`);
    console.log(`   > const c = await ethers.getContractAt("CardNFT", "<CARD_NFT_ADDRESS>")`);
    console.log(`   > await c.setBaseImageURI("ipfs://${folderCID}/cards/")`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
