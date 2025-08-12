import cron from 'node-cron';
import { Order } from '../models/order.model';
import { sendEmail } from '../utils/mailer';
import { sendNotification } from '../controllers/notification.controller';

export const setupCronJobs = () => {
    console.log("🕒 Cron jobs setup initiated.");

    cron.schedule('0 * * * *', async () => {
        console.log('⏰ Running hourly check for overdue orders...');
        try {
            const now = new Date();
            
            const overdueOrders = await Order.find({
                status: { $in: ['picked_up', 'in_use'] },
                'return.scheduledAt': { $lt: now },
                isOverdueNotified: false
            }).populate('customer', 'name email');

            if (overdueOrders.length === 0) {
                console.log('✅ No overdue orders found.');
                return;
            }

            for (const order of overdueOrders) {
                order.status = 'overdue';
                order.isOverdueNotified = true;
                await order.save();

                const customer = order.customer as any;
                await sendEmail({
                    to: customer.email,
                    subject: `Your Rental Order is Overdue!`,
                    html: `<p>Hi ${customer.name}, please note that your order #${order._id.toString().slice(-6)} is now overdue. Please return the items as soon as possible to avoid late fees.</p>`
                });
                
                await sendNotification(
                    customer._id.toString(),
                    'order_overdue',
                    {
                        orderId: order._id,
                        message: `Your order is overdue. Please return the items.`
                    }
                );
                
                console.log(`- Notified user ${customer.email} for overdue order ${order._id}`);
            }

        } catch (error) {
            console.error("Error in overdue check cron job:", error);
        }
    });
};