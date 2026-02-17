import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const userRules = {
    update: [
        body('full_name').optional().isString().isLength({ min: 2 }),
        body('bio').optional().isString().isLength({ max: 500 }),
    ]
};

export const chatRules = {
    send: [
        body('content').notEmpty().withMessage('Content is required'),
        body('message_type').isIn(['text', 'image', 'video', 'voice']).withMessage('Invalid message type'),
    ]
};
