import type { Express } from "express";
import { 
  checkEmailBreaches, 
  getIPGeolocation, 
  getDomainInfo, 
  getPhoneInfo, 
  checkUsername,
  generateHashes 
} from "./osint-apis-real";

export function registerRealAPIRoutes(app: Express) {
  
  // Email OSINT Routes
  app.post("/api/osint/email/breaches", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          error: "Email é obrigatório" 
        });
      }

      const result = await checkEmailBreaches(email);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Erro interno do servidor" 
      });
    }
  });

  // IP Geolocation Routes
  app.post("/api/osint/ip/geolocation", async (req, res) => {
    try {
      const { ip } = req.body;
      
      if (!ip) {
        return res.status(400).json({ 
          success: false, 
          error: "IP é obrigatório" 
        });
      }

      const result = await getIPGeolocation(ip);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Erro interno do servidor" 
      });
    }
  });

  // Domain Info Routes
  app.post("/api/osint/domain/info", async (req, res) => {
    try {
      const { domain } = req.body;
      
      if (!domain) {
        return res.status(400).json({ 
          success: false, 
          error: "Domínio é obrigatório" 
        });
      }

      const result = await getDomainInfo(domain);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Erro interno do servidor" 
      });
    }
  });

  // Phone Info Routes  
  app.post("/api/osint/phone/info", async (req, res) => {
    try {
      const { phone } = req.body;
      
      if (!phone) {
        return res.status(400).json({ 
          success: false, 
          error: "Número de telefone é obrigatório" 
        });
      }

      const result = await getPhoneInfo(phone);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Erro interno do servidor" 
      });
    }
  });

  // Username Check Routes
  app.post("/api/osint/username/check", async (req, res) => {
    try {
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ 
          success: false, 
          error: "Username é obrigatório" 
        });
      }

      const result = await checkUsername(username);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Erro interno do servidor" 
      });
    }
  });

  // Tools Routes
  app.post("/api/tools/hash/generate", async (req, res) => {
    try {
      const { input } = req.body;
      
      if (!input) {
        return res.status(400).json({ 
          success: false, 
          error: "Input é obrigatório" 
        });
      }

      const result = await generateHashes(input);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Erro interno do servidor" 
      });
    }
  });

  // Base64 Encoder/Decoder
  app.post("/api/tools/base64/encode", async (req, res) => {
    try {
      const { input } = req.body;
      
      if (!input) {
        return res.status(400).json({ 
          success: false, 
          error: "Input é obrigatório" 
        });
      }

      const encoded = Buffer.from(input, 'utf8').toString('base64');
      
      res.json({
        success: true,
        data: {
          original: input,
          encoded,
          operation: 'encode'
        },
        source: 'Base64 Encoder Local',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Erro ao codificar" 
      });
    }
  });

  app.post("/api/tools/base64/decode", async (req, res) => {
    try {
      const { input } = req.body;
      
      if (!input) {
        return res.status(400).json({ 
          success: false, 
          error: "Input é obrigatório" 
        });
      }

      const decoded = Buffer.from(input, 'base64').toString('utf8');
      
      res.json({
        success: true,
        data: {
          original: input,
          decoded,
          operation: 'decode'
        },
        source: 'Base64 Decoder Local',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Erro ao decodificar - input inválido" 
      });
    }
  });

  // Password Generator
  app.post("/api/tools/password/generate", async (req, res) => {
    try {
      const { 
        length = 16, 
        includeUppercase = true, 
        includeLowercase = true, 
        includeNumbers = true, 
        includeSymbols = false 
      } = req.body;

      let charset = '';
      if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (includeNumbers) charset += '0123456789';
      if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (!charset) {
        return res.status(400).json({ 
          success: false, 
          error: "Pelo menos um tipo de caractere deve ser selecionado" 
        });
      }

      let password = '';
      const crypto = await import('crypto');
      
      for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        password += charset[randomIndex];
      }

      res.json({
        success: true,
        data: {
          password,
          length,
          strength: length >= 12 ? 'Strong' : length >= 8 ? 'Medium' : 'Weak',
          config: {
            length,
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSymbols
          }
        },
        source: 'Password Generator Local',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Erro ao gerar senha" 
      });
    }
  });

  console.log("✅ Real API routes registered");
}