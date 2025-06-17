import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';


import { Product, ProductDocument } from './product.schema';

// --- DEFINIÇÕES DAS INTERFACES API ---
export interface BrazilianProductApi {
  nome?: string; 
  name?: string; 
  descricao: string;
  categoria: string;
  imagem: string;
  preco: string;
  material: string;
  departamento: string;
  id: string; // ID do produto fornecido pela API
  email?: string; 
  password?: string; // Campos adicionais na API brasileira
  username?: string; // Campos adicionais na API brasileira
}

export interface EuropeanProductApi {
  name: string;
  description: string;
  gallery: string[];
  price: string;
  id: string; // ID do produto fornecido pela API
  details?: {
    adjective?: string;
    material?: string;
  };
  hasDiscount?: boolean;
  discountValue?: string;
}
// --- FIM DAS DEFINIÇÕES DAS INTERFACES API ---


@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    // Injeta o modelo Mongoose para a coleção de produtos
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    // Injeta o HttpService para fazer requisições HTTP
    private httpService: HttpService,
  ) {}

  //  método chamado automaticamente pelo NestJS quando o módulo é inicializado.
  async onModuleInit() {
    console.log('ProductService inicializado. Iniciando populamento de produtos...');
    await this.populateProducts();
  }

  // Lógica para buscar produtos das APIs, normalizá-los e inseri-los no banco de dados.
  async populateProducts(): Promise<void> {
    try {
      // 1. Buscar Produtos Brasileiros
      const brazilianApiUrl = 'https://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider';
      const brazilianProducts = await lastValueFrom(
        this.httpService.get<BrazilianProductApi[]>(brazilianApiUrl).pipe(map(response => response.data))
      );
      console.log(`[LOG] Encontrados ${brazilianProducts.length} produtos brutos da API Brasileira.`);
      const normalizedBrazilianProducts = brazilianProducts.map(p => this.normalizeBrazilianProduct(p));
      console.log(`[DEBUG] Total de produtos brasileiros normalizados: ${normalizedBrazilianProducts.length}`);


      // 2. Buscar Produtos Europeus
      const europeanApiUrl = 'https://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider';
      const europeanProducts = await lastValueFrom(
        this.httpService.get<EuropeanProductApi[]>(europeanApiUrl).pipe(map(response => response.data))
      );
      console.log(`[LOG] Encontrados ${europeanProducts.length} produtos brutos da API Europeia.`);
      const normalizedEuropeanProducts = europeanProducts.map(p => this.normalizeEuropeanProduct(p));
      console.log(`[DEBUG] Total de produtos europeus normalizados: ${normalizedEuropeanProducts.length}`);


      // 3. Combinar e Processar Produtos para Lidar com Duplicatas por (supplierProductId + supplier)
      // Map para deduplicar, garantindo que a combinação de 'fornecedor + ID do produto do fornecedor' seja única.
      const uniqueProductsMap = new Map<string, Product>();
      const allNormalizedProducts = [...normalizedBrazilianProducts, ...normalizedEuropeanProducts];
      console.log(`[LOG] Total de ${allNormalizedProducts.length} produtos normalizados (antes de deduplicação por fornecedor e ID).`);

      let duplicatesDetected = 0;
      allNormalizedProducts.forEach(product => {
        // Cria uma chave única combinando o nome do fornecedor e o ID do produto do fornecedor.
        // Ex: "brazilian-1", "european-1"
        const uniqueKey = `${product.supplier}-${product.supplierProductId}`;
        if (!uniqueProductsMap.has(uniqueKey)) {
          uniqueProductsMap.set(uniqueKey, product);
        } else {
          duplicatesDetected++;
        }
      });
      console.log(`[DEBUG] ${duplicatesDetected} produtos duplicados (mesmo Fornecedor e mesmo ID) detectados e ignorados pelo Map.`);

      const finalProductsToInsert = Array.from(uniqueProductsMap.values());
      console.log(`[LOG] Total de ${finalProductsToInsert.length} produtos únicos prontos para inserção no banco de dados.`);

      // Log para verificar a distribuição final
      const countBrazilianFinal = finalProductsToInsert.filter(p => p.supplier === 'brazilian').length;
      const countEuropeanFinal = finalProductsToInsert.filter(p => p.supplier === 'european').length;
      console.log(`[DEBUG] Produtos Brasileiros únicos para inserir: ${countBrazilianFinal}`);
      console.log(`[DEBUG] Produtos Europeus únicos para inserir: ${countEuropeanFinal}`);


      //  Limpa a coleção ANTES de inserir.
      const countBeforeDelete = await this.productModel.countDocuments();
      if (countBeforeDelete > 0) {
        console.log(`[LOG] Limpando: ${countBeforeDelete} documentos existentes na coleção 'products'...`);
        await this.productModel.deleteMany({});
        console.log(`[LOG] Coleção 'products' limpa.`);
      } else {
       console.log("[LOG] Coleção 'products' já está vazia, prosseguindo com a inserção.");
      }

      // Inseri os produtos únicos no banco de dados
      if (finalProductsToInsert.length > 0) {
        await this.productModel.insertMany(finalProductsToInsert);
        console.log(`[LOG] ${finalProductsToInsert.length} produtos populados com sucesso no banco de dados!`);
      } else {
        console.log('[LOG] Nenhum produto único para inserir no banco de dados.');
      }

    } catch (error) {
      console.error('[ERRO] Erro ao popular produtos:', error.message);
      // Se o 'unique: true' no schema não fosse removido,
      // eu veria erros de 'E11000 duplicate key error collection' aqui.
    }
  }

  // Normaliza a estrutura de um produto da API Brasileira para o ProductSchema.
  private normalizeBrazilianProduct(product: BrazilianProductApi): Product {
    return {
      name: product.nome || product.name || 'Nome não disponível',
      description: product.descricao || 'Descrição não disponível',
      category: product.categoria || 'Categoria não disponível',
      image: product.imagem || null,
      price: parseFloat(product.preco || '0') || 0,
      material: product.material || null,
      department: product.departamento || null,
      supplierProductId: product.id, // Usa o ID original da API
      supplier: 'brazilian', // Identifica o fornecedor
      hasDiscount: false, // Default para produtos brasileiros (assumido)
      discountValue: 0,   // Default para produtos brasileiros (assumido)
      gallery: product.imagem ? [product.imagem] : [],
      adjective: null,
      detailsMaterial: null,
    };
  }

  // Normaliza a estrutura de um produto da API Europeia para o ProductSchema.
  private normalizeEuropeanProduct(product: EuropeanProductApi): Product {
    return {
      name: product.name,
      description: product.description || 'Descrição não disponível',
      category: null, // Categoria não disponível na API europeia
      image: product.gallery?.[0] || null, // Pega a primeira imagem da galeria
      price: parseFloat(product.price || '0') || 0,
      material: null,
      department: null,
      supplierProductId: product.id, // Usa o ID original da API
      supplier: 'european', // Identifica o fornecedor
      hasDiscount: product.hasDiscount || false,
      discountValue: parseFloat(product.discountValue || '0') || 0,
      gallery: product.gallery || [],
      adjective: product.details?.adjective || null,
      detailsMaterial: null,
    };
  }

  // Método para buscar todos os produtos do banco de dados.
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  // --PRODUTO PELO ID ---
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Produto com ID "${id}" não encontrado.`);
    }
    return product;
  }
  

}