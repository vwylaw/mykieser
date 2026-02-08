import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MACHINE_IMAGES = [
    { code: "A1", image_url: "https://www.kieser.com.au/fileadmin/_processed_/c/9/csm_A1Usage_3d028effc4.jpg" },
    { code: "A2", image_url: "https://www.kieser.com.au/fileadmin/_processed_/f/e/csm_csm_A2-Beugung_im_Huftgelenk_7429468169_aaa1ecc1ef.jpg" },
    { code: "A3", image_url: "https://www.kieser.com.au/fileadmin/_processed_/5/e/csm_csm_A3-Spreizung_im_Hutgelenk_538279c2b6_44204607cc.jpg" },
    { code: "A4", image_url: "https://www.kieser.com.au/fileadmin/_processed_/9/f/csm_csm_A4-Anziehung_im_Huftgelenk_85a69b6a80_d6d774280a.jpg" },
    { code: "A5", image_url: "https://www.kieser.com.au/fileadmin/_processed_/b/d/csm_csm_A5_Piktogramm_02_f2c0105040_43de77b2ea.jpg" },
    { code: "B1", image_url: "https://www.kieser.com.au/fileadmin/_processed_/0/1/csm_csm_B1-Beinstreckung_ee98ad7586_77c6027483.jpg" },
    { code: "B5", image_url: "https://www.kieser.com.au/fileadmin/_processed_/d/4/csm_csm_B5-Beugung_im_Kniegelenk_in_Bauchlage_1dbf5faa3c_651175cbd3.jpg" },
    { code: "B6", image_url: "https://www.kieser.com.au/fileadmin/_processed_/9/2/csm_csm_B6-Beinpressen_63d9a10d4b_a9a2489b05.jpg" },
    { code: "B7", image_url: "https://www.kieser.com.au/fileadmin/_processed_/5/d/csm_csm_B7-Beugung_im_Kniegelenk_sitzend_dcf1e3ace4_a3f4a8b491.jpg" },
    { code: "B8", image_url: "https://www.kieser.com.au/fileadmin/_processed_/d/0/csm_csm_B8-Fussheben_b333d68d8e_055c7844d7.jpg" },
    { code: "C1", image_url: "https://www.kieser.com.au/fileadmin/_processed_/0/7/csm_csm_C1-Uberzug_ae41f4eef0_fd77997c96.jpg" },
    { code: "C2", image_url: "https://www.kieser.com.au/fileadmin/_processed_/9/c/csm_csm_C2_Piktogramm_01_1d9d32ebe2_23476f36c5.jpg" },
    { code: "C3", image_url: "https://www.kieser.com.au/fileadmin/_processed_/b/1/csm_csm_C3-Armzug_19963c6250_ef38570f96.jpg" },
    { code: "C5", image_url: "https://www.kieser.com.au/fileadmin/_processed_/e/3/csm_csm_C5-Rudern_im_Schultergelenk_29cb11c69d_217383f1b9.jpg" },
    { code: "C7", image_url: "https://www.kieser.com.au/fileadmin/_processed_/2/b/csm_csm_C7-Ruderzug_f10c626ef2_41c4c67b19.jpg" },
    { code: "D5", image_url: "https://www.kieser.com.au/fileadmin/_processed_/6/8/csm_csm_D5-Armkreuzen_19bac098d6_017210fc51.jpg" },
    { code: "D6", image_url: "https://www.kieser.com.au/fileadmin/_processed_/e/0/csm_csm_D6-Brustdrucken_394665d40c_e65b1aff75.jpg" },
    { code: "D7", image_url: "https://www.kieser.com.au/fileadmin/_processed_/5/c/csm_csm_D7-Barrenstutz_sitzend_c6e20b35b9_a9a919f6c4.jpg" },
    { code: "E1", image_url: "https://www.kieser.com.au/fileadmin/_processed_/9/6/csm_csm_E1-Nacken_Drucken_562e5b5ae5_b55f6d33ba.jpg" },
    { code: "E2", image_url: "https://www.kieser.com.au/fileadmin/_processed_/a/3/csm_csm_E2-Seitheben_3e0e48e76d_2b7cdbef46.jpg" },
    { code: "E3", image_url: "https://www.kieser.com.au/fileadmin/_processed_/0/e/csm_csm_E3-Drucken_cb0a6e24c1_3bfadd1114.jpg" },
    { code: "E4", image_url: "https://www.kieser.com.au/fileadmin/_processed_/0/3/csm_csm_E4-Schulterdrehung_nach_innen_a9e5cc62e5_6b1de03b8c.jpg" },
    { code: "E5", image_url: "https://www.kieser.com.au/fileadmin/_processed_/1/a/csm_E5-Schulterdrehung_nach_aussen_bc26c97309.jpg" },
    { code: "F1_1", image_url: "https://www.kieser.com.au/fileadmin/_processed_/c/c/csm_csm_F1-Rumpfdrehung_12439e8f40_27ff28d2ae.jpg" },
    { code: "F2_1", image_url: "https://www.kieser.com.au/fileadmin/_processed_/9/e/csm_csm_F2-Ruckenflexion_f568ac8419_c80fcf37d9.jpg" },
    { code: "F3_1", image_url: "https://www.kieser.com.au/fileadmin/_processed_/3/b/csm_csm_F3-Ruckenstreckung_922efc96f5_8fa9ed745d.jpg" },
    { code: "G1", image_url: "https://www.kieser.com.au/fileadmin/_processed_/2/d/csm_csm_G1-Schulterheben_8f35fd97b8_6d0e754159.jpg" },
    { code: "G3", image_url: "https://www.kieser.com.au/fileadmin/_processed_/d/c/csm_csm_G3-Halsbeugung_seitwarts_b4131a3347_606f2cda04.jpg" },
    { code: "G4", image_url: "https://www.kieser.com.au/fileadmin/_processed_/4/0/csm_csm_G4-Halsbeugung_nach_vorne_84b6935475_7ab8f2cac2.jpg" },
    { code: "G5", image_url: "https://www.kieser.com.au/fileadmin/_processed_/0/c/csm_csm_G5-Nackenstreckung_aacd7847ad_bba6497210.jpg" },
    { code: "H1", image_url: "https://www.kieser.com.au/fileadmin/_processed_/4/8/csm_csm_H1-Armbeugung_9f1ee46ef4_fa149bb4de.jpg" },
    { code: "H2", image_url: "https://www.kieser.com.au/fileadmin/_processed_/a/1/csm_csm_H2-Armstreckung_c8ca87018f_2be74ee8b2.jpg" },
    { code: "H3", image_url: "https://www.kieser.com.au/fileadmin/_processed_/8/3/csm_csm_H3-Handdrehung_nach_innen_14281c0c6c_99c4494cb2.jpg" },
    { code: "H4", image_url: "https://www.kieser.com.au/fileadmin/_processed_/1/f/csm_csm_H4-Handdrehung_nach_aussen_637fdb591b_479c7f0845.jpg" },
    { code: "H5", image_url: "https://www.kieser.com.au/fileadmin/_processed_/b/d/csm_csm_H5-Beugung_im_Handgelenk_813c63f21a_f13234b4e6.jpg" },
    { code: "H6", image_url: "https://www.kieser.com.au/fileadmin/_processed_/c/6/csm_csm_H6-Streckung_im_Handgelenk_b5c4d0c9c2_b08568b7b5.jpg" },
    { code: "H7", image_url: "https://www.kieser.com.au/fileadmin/_processed_/9/c/csm_csm_H7-Fingerbeugung_fd45e7e0d5_a24bf22fff.jpg" },
    { code: "J1", image_url: "https://www.kieser.com.au/fileadmin/_processed_/8/7/csm_csm_J1-Fersenheben_794378ac1f_2cf1c71275.jpg" },
    { code: "J2", image_url: "https://www.kieser.com.au/fileadmin/_processed_/5/b/csm_csm_J2-Klimmzug_vorne_e130ecbe64_33fde122d1.jpg" },
    { code: "J3", image_url: "https://www.kieser.com.au/fileadmin/_processed_/6/0/csm_csm_J3-Klimmzug_seitlich_a9fc97eb46_2b43d62da2.jpg" },
    { code: "J4", image_url: "https://www.kieser.com.au/fileadmin/_processed_/5/2/csm_csm_J4-Barrenstutz_63be341469_5f692cd080.jpg" },
    { code: "J5", image_url: "https://www.kieser.com.au/fileadmin/_processed_/f/5/csm_csm_J5-Armstreckung_stehend_9424a063b9_45be958ef9.jpg" },
    { code: "J9", image_url: "https://www.kieser.com.au/fileadmin/_processed_/2/d/csm_csm_J9-Seitbeuge_0258139611_e4301a082f.jpg" },
    { code: "K2", image_url: "https://www.kieser.com.au/fileadmin/_processed_/c/2/csm_csm_J2-Klimmzug_vorne_d781e4d27a_3bb03a66f3.jpg" },
    { code: "K3", image_url: "https://www.kieser.com.au/fileadmin/_processed_/e/8/csm_csm_J3-Klimmzug_seitlich_6141a09c29_e16613cec6.jpg" },
    { code: "K4", image_url: "https://www.kieser.com.au/fileadmin/_processed_/9/1/csm_J4-Barrenstutz_141af2cf16.jpg" },
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);

        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        }, (res) => {
            if (res.statusCode === 200) {
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(filepath);
                });
            } else {
                fs.unlink(filepath, () => { });
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
};

(async () => {
    const outputDir = path.join(__dirname, 'public', 'machines');

    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const machine of MACHINE_IMAGES) {
        const ext = path.extname(machine.image_url);
        const filename = `${machine.code}${ext}`;
        const filepath = path.join(outputDir, filename);

        try {
            console.log(`Downloading ${machine.code}...`);
            await downloadImage(machine.image_url, filepath);
            console.log(`✓ Downloaded ${filename}`);
        } catch (err) {
            console.error(`✗ Failed to download ${machine.code}: ${err.message}`);
        }
    }

    console.log('\nDownload complete!');
})();
