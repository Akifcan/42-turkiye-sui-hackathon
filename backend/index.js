import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Enoki API Configuration
const ENOKI_API_URL = 'https://api.enoki.mystenlabs.com';
const ENOKI_PRIVATE_API_KEY = "enoki_private_0225f8fa888be8bd14c1f6b9349e4749";

// Sui Client
const suiClient = new SuiClient({ 
  url: 'https://fullnode.testnet.sui.io:443' 
});

/**
 * POST /api/sponsor-transaction
 * Sponsors a transaction using Enoki
 * 
 * Body:
 * {
 *   transactionBlockKindBytes: string (base64),
 *   sender: string (user address),
 *   zkLoginJwt: string (JWT token from zkLogin)
 * }
 */
app.post('/api/sponsor-transaction', async (req, res) => {
  try {
    console.log('🔍 Received request body:', JSON.stringify(req.body).substring(0, 200));
    
    const { transactionBlockKindBytes, sender, zkLoginJwt } = req.body;

    console.log('🔍 Field check:');
    console.log('  - transactionBlockKindBytes:', transactionBlockKindBytes ? '✅ Present' : '❌ Missing');
    console.log('  - sender:', sender ? '✅ Present' : '❌ Missing');
    console.log('  - zkLoginJwt:', zkLoginJwt ? '✅ Present' : '❌ Missing');

    if (!transactionBlockKindBytes || !sender) {
      return res.status(400).json({
        error: 'Missing required fields: transactionBlockKindBytes, sender',
        received: {
          transactionBlockKindBytes: !!transactionBlockKindBytes,
          sender: !!sender,
          zkLoginJwt: !!zkLoginJwt,
        }
      });
    }

    // zkLoginJwt is optional - if not provided, we'll use private key sponsoring
    if (!zkLoginJwt) {
      console.log('⚠️ No zkLogin JWT provided - using private key sponsoring');
    }

    console.log('📝 Step 1: Requesting sponsorship from Enoki...');
    console.log('Sender:', sender);

    // Step 1: Request transaction sponsorship from Enoki
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENOKI_PRIVATE_API_KEY}`,
    };

    // Add zkLogin JWT to headers if provided
    if (zkLoginJwt) {
      headers['zklogin-jwt'] = zkLoginJwt;
    }

    const sponsorResponse = await fetch(`${ENOKI_API_URL}/v1/transaction-blocks/sponsor`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        network: 'testnet',
        transactionBlockKindBytes,
        sender, // Add sender address to Enoki API request
      }),
    });

    if (!sponsorResponse.ok) {
      const errorText = await sponsorResponse.text();
      console.error('❌ Enoki sponsor request failed:', errorText);
      return res.status(sponsorResponse.status).json({
        error: 'Failed to sponsor transaction',
        details: errorText,
      });
    }

    const sponsorData = await sponsorResponse.json();
    console.log('✅ Step 1 Complete: Transaction sponsored');
    console.log('Transaction Digest:', sponsorData.digest);

    // Step 2: User signs the transaction (this happens on frontend)
    // We return the bytes that need to be signed
    
    res.json({
      success: true,
      digest: sponsorData.digest,
      bytes: sponsorData.bytes,
      message: 'Transaction sponsored. Please sign the transaction bytes on the frontend.',
    });

  } catch (error) {
    console.error('❌ Error sponsoring transaction:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

/**
 * POST /api/execute-sponsored-transaction
 * Executes a sponsored transaction after user signature
 * 
 * Body:
 * {
 *   digest: string,
 *   signature: string (user signature),
 *   zkLoginJwt: string
 * }
 */
app.post('/api/execute-sponsored-transaction', async (req, res) => {
  try {
    const { digest, signature, zkLoginJwt } = req.body;

    if (!digest || !signature) {
      return res.status(400).json({
        error: 'Missing required fields: digest, signature'
      });
    }

    console.log('📝 Step 2: Submitting signed transaction to Enoki...');
    console.log('Digest:', digest);

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENOKI_PRIVATE_API_KEY}`,
    };

    // Add zkLogin JWT to headers if provided
    if (zkLoginJwt) {
      headers['zklogin-jwt'] = zkLoginJwt;
    }

    // Submit the signed transaction to Enoki for final sponsorship
    const executeResponse = await fetch(`${ENOKI_API_URL}/v1/transaction-blocks/sponsor/${digest}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        signature,
      }),
    });

    if (!executeResponse.ok) {
      const errorText = await executeResponse.text();
      console.error('❌ Enoki execution failed:', errorText);
      return res.status(executeResponse.status).json({
        error: 'Failed to execute sponsored transaction',
        details: errorText,
      });
    }

    const executeData = await executeResponse.json();
    console.log('✅ Step 2 Complete: Transaction executed');
    console.log('Sponsored Transaction:', executeData);

    res.json({
      success: true,
      ...executeData,
    });

  } catch (error) {
    console.error('❌ Error executing sponsored transaction:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    enokiConfigured: !!ENOKI_PRIVATE_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log('🚀 Backend server running on port', PORT);
  console.log('🔑 Enoki Private Key:', ENOKI_PRIVATE_API_KEY ? '✅ Configured' : '❌ Missing');
  console.log('📡 Enoki API URL:', ENOKI_API_URL);
});

