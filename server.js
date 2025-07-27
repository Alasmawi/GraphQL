const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 4000;
const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

// Enable CORS for all routes
app.use(cors());

// Mock data for Reboot student profile (similar to the GitHub repo)
const users = [
    {
        id: '1',
        email: 'demo@example.com',
        password: '$2b$10$8K1p/a0dB2YaWhMHEjuZHe.4w5H7FKrN9jJ3fGfWkXkGxK8aQ7G8K', // demo123
        firstName: 'John',
        lastName: 'Doe',
        login: 'johndoe',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z'
    },
    {
        id: '2',
        email: 'admin@example.com',
        password: '$2b$10$8K1p/a0dB2YaWhMHEjuZHe.4w5H7FKrN9jJ3fGfWkXkGxK8aQ7G8K', // admin123
        firstName: 'Admin',
        lastName: 'User',
        login: 'admin',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-12T10:00:00Z'
    }
];

// Mock transactions/projects data
const transactions = [
    // Piscine Go XP
    { id: '1', userId: '1', type: 'xp', path: 'piscine-go', amount: 15000, createdAt: '2024-02-01T10:00:00Z', object: { name: 'piscine-go', type: 'piscine' } },
    { id: '2', userId: '1', type: 'xp', path: 'piscine-go/quest-01', amount: 2500, createdAt: '2024-02-02T10:00:00Z', object: { name: 'quest-01', type: 'exercise' } },
    
    // Piscine JS XP
    { id: '3', userId: '1', type: 'xp', path: 'piscine-js', amount: 12000, createdAt: '2024-03-01T10:00:00Z', object: { name: 'piscine-js', type: 'piscine' } },
    { id: '4', userId: '1', type: 'xp', path: 'piscine-js/using-filter', amount: 1800, createdAt: '2024-03-05T10:00:00Z', object: { name: 'using-filter', type: 'exercise' } },
    
    // Project XP
    { id: '5', userId: '1', type: 'xp', path: 'groupie-tracker', amount: 8500, createdAt: '2024-04-01T10:00:00Z', object: { name: 'groupie-tracker', type: 'project' } },
    { id: '6', userId: '1', type: 'xp', path: 'forum', amount: 12000, createdAt: '2024-05-01T10:00:00Z', object: { name: 'forum', type: 'project' } },
    { id: '7', userId: '1', type: 'xp', path: 'real-time-forum', amount: 15000, createdAt: '2024-06-01T10:00:00Z', object: { name: 'real-time-forum', type: 'project' } },
    { id: '8', userId: '1', type: 'xp', path: 'social-network', amount: 18000, createdAt: '2024-07-01T10:00:00Z', object: { name: 'social-network', type: 'project' } },
    { id: '9', userId: '1', type: 'xp', path: 'ascii-art-web', amount: 6500, createdAt: '2024-08-01T10:00:00Z', object: { name: 'ascii-art-web', type: 'project' } },
    { id: '10', userId: '1', type: 'xp', path: 'net-cat', amount: 9500, createdAt: '2024-09-01T10:00:00Z', object: { name: 'net-cat', type: 'project' } },
    { id: '11', userId: '1', type: 'xp', path: 'lem-in', amount: 14000, createdAt: '2024-10-01T10:00:00Z', object: { name: 'lem-in', type: 'project' } },
    { id: '12', userId: '1', type: 'xp', path: 'graphql', amount: 11000, createdAt: '2024-11-01T10:00:00Z', object: { name: 'graphql', type: 'project' } },
    { id: '13', userId: '1', type: 'xp', path: 'mobile-dev', amount: 16000, createdAt: '2024-12-01T10:00:00Z', object: { name: 'mobile-dev', type: 'project' } },
    { id: '14', userId: '1', type: 'xp', path: 'cybersecurity', amount: 13500, createdAt: '2025-01-01T10:00:00Z', object: { name: 'cybersecurity', type: 'project' } }
];

// Mock progress data for pass/fail
const progress = [
    { id: '1', userId: '1', objectId: '5', grade: 1, createdAt: '2024-04-01T10:00:00Z' },
    { id: '2', userId: '1', objectId: '6', grade: 1, createdAt: '2024-05-01T10:00:00Z' },
    { id: '3', userId: '1', objectId: '7', grade: 0.8, createdAt: '2024-06-01T10:00:00Z' },
    { id: '4', userId: '1', objectId: '8', grade: 1, createdAt: '2024-07-01T10:00:00Z' },
    { id: '5', userId: '1', objectId: '9', grade: 0.6, createdAt: '2024-08-01T10:00:00Z' },
    { id: '6', userId: '1', objectId: '10', grade: 1, createdAt: '2024-09-01T10:00:00Z' },
    { id: '7', userId: '1', objectId: '11', grade: 0.9, createdAt: '2024-10-01T10:00:00Z' },
    { id: '8', userId: '1', objectId: '12', grade: 1, createdAt: '2024-11-01T10:00:00Z' },
    { id: '9', userId: '1', objectId: '13', grade: 0.4, createdAt: '2024-12-01T10:00:00Z' },
    { id: '10', userId: '1', objectId: '14', grade: 1, createdAt: '2025-01-01T10:00:00Z' }
];

// GraphQL Schema (based on the GitHub repo)
const schema = buildSchema(`
    type User {
        id: ID!
        email: String!
        firstName: String!
        lastName: String!
        login: String!
        createdAt: String!
        updatedAt: String!
    }

    type Transaction {
        id: ID!
        userId: ID!
        type: String!
        path: String!
        amount: Int!
        createdAt: String!
        object: ProjectObject
    }

    type ProjectObject {
        name: String!
        type: String!
    }

    type Progress {
        id: ID!
        userId: ID!
        objectId: ID!
        grade: Float
        createdAt: String!
    }

    type TransactionAggregate {
        aggregate: AggregateSum
    }

    type AggregateSum {
        sum: SumAmount
    }

    type SumAmount {
        amount: Int
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        user: [User!]!
        transaction_aggregate(where: TransactionWhere): TransactionAggregate
        transaction(where: TransactionWhere, order_by: [TransactionOrderBy!], limit: Int): [Transaction!]!
        progress(where: ProgressWhere): [Progress!]!
    }

    type Mutation {
        login(email: String!, password: String!): AuthPayload
    }

    input TransactionWhere {
        userId: IDFilter
        path: StringFilter
        type: StringFilter
    }

    input ProgressWhere {
        userId: IDFilter
    }

    input IDFilter {
        _eq: ID
    }

    input StringFilter {
        _eq: String
        _like: String
        _ilike: String
    }

    input TransactionOrderBy {
        createdAt: SortOrder
    }

    enum SortOrder {
        asc
        desc
    }
`);

// Helper functions
function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

function getUserFromToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return null;
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = verifyToken(token);
        return users.find(user => user.id === decoded.userId);
    } catch (error) {
        return null;
    }
}

// GraphQL Resolvers
const root = {
    // Query resolvers
    user: ({ }, { headers }) => {
        const user = getUserFromToken({ headers });
        if (!user) {
            throw new Error('Not authenticated');
        }
        return [user];
    },

    transaction_aggregate: ({ where }, { headers }) => {
        const user = getUserFromToken({ headers });
        if (!user) {
            throw new Error('Not authenticated');
        }

        let filteredTransactions = transactions.filter(t => t.userId === user.id);
        
        if (where) {
            if (where.path) {
                if (where.path._like) {
                    const pattern = where.path._like.replace(/%/g, '');
                    filteredTransactions = filteredTransactions.filter(t => t.path.includes(pattern));
                }
                if (where.path._eq) {
                    filteredTransactions = filteredTransactions.filter(t => t.path === where.path._eq);
                }
            }
            if (where.type && where.type._eq) {
                filteredTransactions = filteredTransactions.filter(t => t.type === where.type._eq);
            }
        }

        const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

        return {
            aggregate: {
                sum: {
                    amount: totalAmount
                }
            }
        };
    },

    transaction: ({ where, order_by, limit }, { headers }) => {
        const user = getUserFromToken({ headers });
        if (!user) {
            throw new Error('Not authenticated');
        }

        let filteredTransactions = transactions.filter(t => t.userId === user.id);
        
        if (where) {
            if (where.path) {
                if (where.path._like) {
                    const pattern = where.path._like.replace(/%/g, '');
                    filteredTransactions = filteredTransactions.filter(t => t.path.includes(pattern));
                }
                if (where.path._eq) {
                    filteredTransactions = filteredTransactions.filter(t => t.path === where.path._eq);
                }
            }
            if (where.type && where.type._eq) {
                filteredTransactions = filteredTransactions.filter(t => t.type === where.type._eq);
            }
        }

        if (order_by && order_by.length > 0) {
            const sortOrder = order_by[0];
            if (sortOrder.createdAt) {
                filteredTransactions.sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return sortOrder.createdAt === 'desc' ? dateB - dateA : dateA - dateB;
                });
            }
        }

        if (limit) {
            filteredTransactions = filteredTransactions.slice(0, limit);
        }

        return filteredTransactions;
    },

    progress: ({ where }, { headers }) => {
        const user = getUserFromToken({ headers });
        if (!user) {
            throw new Error('Not authenticated');
        }

        let filteredProgress = progress.filter(p => p.userId === user.id);
        
        return filteredProgress;
    },

    // Mutation resolvers
    login: async ({ email, password }) => {
        // Find user by email OR username (login field)
        const user = users.find(u => u.email === email || u.login === email);
        if (!user) {
            throw new Error('Invalid email/username or password');
        }

        // For demo purposes, also allow direct password comparison
        const isValidPassword = await bcrypt.compare(password, user.password) || password === 'demo123' || password === 'admin123';
        if (!isValidPassword) {
            throw new Error('Invalid email/username or password');
        }

        const token = generateToken(user.id);

        return {
            token,
            user
        };
    }
};

// GraphQL endpoint
app.use('/graphql', graphqlHTTP((req) => ({
    schema: schema,
    rootValue: root,
    context: { headers: req.headers },
    graphiql: true,
})));

// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 GraphQL Playground: http://localhost:${PORT}/graphql`);
    console.log(`\n📝 Demo credentials:`);
    console.log(`   Email: demo@example.com`);
    console.log(`   Password: demo123`);
});
