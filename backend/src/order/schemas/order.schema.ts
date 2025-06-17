import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// Definindo a interface para um item dentro do pedido

@Schema({ _id: false }) 
export class OrderItem {
  @Prop({ type: Types.ObjectId, required: true }) 
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string; 

  @Prop({ required: true })
  price: number; 

  @Prop({ required: false, default: 0 }) 
  discountValue?: number;

  @Prop({ required: true })
  quantity: number; 

  @Prop({ required: false })
  image?: string; 
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// Definindo o esquema principal do Pedido
export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true }) 
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true, required: false }) 
  userId?: Types.ObjectId; 

  @Prop({ type: [OrderItemSchema], required: true }) 
  items: OrderItem[];

  @Prop({ required: true })
  totalPrice: number; 

  @Prop({ required: false }) 
  paymentStatus?: string;

  @Prop({ required: false }) 
  paymentType?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);