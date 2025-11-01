-- ============================================
-- SUPABASE DATABASE POPULATION QUERIES
-- Julius Baer AML Platform
-- ============================================

-- Run these queries in Supabase SQL Editor to populate your database
-- with realistic sample data for testing

-- ============================================
-- CLEAR EXISTING DATA (Optional - use if you want fresh start)
-- ============================================
-- TRUNCATE TABLE alerts CASCADE;

-- ============================================
-- INSERT MORE SAMPLE ALERTS
-- ============================================

-- Insert 20 additional alerts with variety of priorities and statuses
INSERT INTO alerts (
  alert_id, priority, client, client_id, type, amount, currency, 
  risk_score, status, timestamp, country, transaction_type, 
  counterparty, purpose, date
) VALUES 
-- Critical Alerts
(
  'ALT-790',
  'CRITICAL',
  'Offshore Holdings Ltd',
  'CLI-789',
  'High-Risk Jurisdiction Transfer',
  500000,
  'USD',
  98,
  'pending',
  NOW() - INTERVAL '2 hours',
  'Cayman Islands',
  'Wire Transfer',
  'Shell Company XYZ',
  'Investment transfer to high-risk jurisdiction',
  TO_CHAR(NOW(), 'DD/MM/YYYY')
),
(
  'ALT-791',
  'CRITICAL',
  'Diamond Trading Corp',
  'CLI-234',
  'Suspicious Cash Deposit Pattern',
  750000,
  'CHF',
  96,
  'investigating',
  NOW() - INTERVAL '5 hours',
  'Switzerland',
  'Cash Deposit',
  'Multiple Locations',
  'Structured deposits below reporting threshold',
  TO_CHAR(NOW(), 'DD/MM/YYYY')
),

-- High Priority Alerts
(
  'ALT-792',
  'HIGH',
  'Tech Innovations AG',
  'CLI-567',
  'Unusual Transaction Volume',
  320000,
  'EUR',
  85,
  'pending',
  NOW() - INTERVAL '1 day',
  'Germany',
  'Business Payment',
  'Software Solutions GmbH',
  'Large software licensing payment',
  TO_CHAR(NOW() - INTERVAL '1 day', 'DD/MM/YYYY')
),
(
  'ALT-793',
  'HIGH',
  'Real Estate Holdings SA',
  'CLI-890',
  'Property Transaction Anomaly',
  1200000,
  'CHF',
  88,
  'investigating',
  NOW() - INTERVAL '3 hours',
  'Switzerland',
  'Real Estate Purchase',
  'Luxury Properties Zurich',
  'Commercial property acquisition',
  TO_CHAR(NOW(), 'DD/MM/YYYY')
),
(
  'ALT-794',
  'HIGH',
  'Import Export Ltd',
  'CLI-445',
  'Cross-Border Trade Alert',
  450000,
  'USD',
  83,
  'pending',
  NOW() - INTERVAL '6 hours',
  'Hong Kong',
  'Trade Finance',
  'Asian Trading Partners',
  'Large import payment',
  TO_CHAR(NOW(), 'DD/MM/YYYY')
),

-- Medium Priority Alerts
(
  'ALT-795',
  'MEDIUM',
  'Consulting Services Inc',
  'CLI-112',
  'Payment Pattern Change',
  85000,
  'CHF',
  65,
  'pending',
  NOW() - INTERVAL '2 days',
  'Switzerland',
  'Service Payment',
  'Corporate Client',
  'Consulting fees - quarterly payment',
  TO_CHAR(NOW() - INTERVAL '2 days', 'DD/MM/YYYY')
),
(
  'ALT-796',
  'MEDIUM',
  'Manufacturing Solutions',
  'CLI-334',
  'Vendor Payment Review',
  120000,
  'EUR',
  62,
  'resolved',
  NOW() - INTERVAL '3 days',
  'Italy',
  'Supplier Payment',
  'Equipment Supplier SpA',
  'Machinery purchase',
  TO_CHAR(NOW() - INTERVAL '3 days', 'DD/MM/YYYY')
),
(
  'ALT-797',
  'MEDIUM',
  'Investment Fund Alpha',
  'CLI-556',
  'Portfolio Rebalancing',
  250000,
  'CHF',
  68,
  'investigating',
  NOW() - INTERVAL '1 day',
  'Switzerland',
  'Investment Transfer',
  'Fund Manager',
  'Asset reallocation',
  TO_CHAR(NOW() - INTERVAL '1 day', 'DD/MM/YYYY')
),
(
  'ALT-798',
  'MEDIUM',
  'Pharmaceutical Research',
  'CLI-667',
  'R&D Payment Verification',
  180000,
  'USD',
  70,
  'pending',
  NOW() - INTERVAL '12 hours',
  'United States',
  'Research Payment',
  'University Lab',
  'Clinical trial funding',
  TO_CHAR(NOW(), 'DD/MM/YYYY')
),

-- Low Priority Alerts
(
  'ALT-799',
  'LOW',
  'Small Business Ltd',
  'CLI-778',
  'Routine Transaction Review',
  35000,
  'CHF',
  45,
  'resolved',
  NOW() - INTERVAL '4 days',
  'Switzerland',
  'Business Payment',
  'Local Supplier',
  'Monthly inventory purchase',
  TO_CHAR(NOW() - INTERVAL '4 days', 'DD/MM/YYYY')
),
(
  'ALT-800',
  'LOW',
  'Retail Chain SA',
  'CLI-889',
  'Standard Compliance Check',
  52000,
  'CHF',
  48,
  'pending',
  NOW() - INTERVAL '1 day',
  'Switzerland',
  'Retail Payment',
  'Wholesale Distributor',
  'Stock replenishment',
  TO_CHAR(NOW() - INTERVAL '1 day', 'DD/MM/YYYY')
),
(
  'ALT-801',
  'LOW',
  'Professional Services',
  'CLI-990',
  'Periodic Review',
  28000,
  'EUR',
  42,
  'resolved',
  NOW() - INTERVAL '5 days',
  'France',
  'Service Fee',
  'Legal Advisors',
  'Legal consultation fees',
  TO_CHAR(NOW() - INTERVAL '5 days', 'DD/MM/YYYY')
),

-- More variety
(
  'ALT-802',
  'HIGH',
  'Crypto Trading Platform',
  'CLI-101',
  'Digital Asset Transaction',
  890000,
  'USD',
  89,
  'pending',
  NOW() - INTERVAL '8 hours',
  'Singapore',
  'Cryptocurrency',
  'Exchange Platform',
  'Large crypto conversion',
  TO_CHAR(NOW(), 'DD/MM/YYYY')
),
(
  'ALT-803',
  'CRITICAL',
  'Luxury Goods Trader',
  'CLI-202',
  'High-Value Goods Transaction',
  2100000,
  'CHF',
  94,
  'investigating',
  NOW() - INTERVAL '4 hours',
  'Switzerland',
  'Luxury Goods',
  'International Dealer',
  'Art and jewelry purchase',
  TO_CHAR(NOW(), 'DD/MM/YYYY')
),
(
  'ALT-804',
  'MEDIUM',
  'Automotive Dealership',
  'CLI-303',
  'Vehicle Sales Review',
  145000,
  'CHF',
  58,
  'pending',
  NOW() - INTERVAL '1 day',
  'Switzerland',
  'Vehicle Sale',
  'Private Buyer',
  'Luxury vehicle purchase',
  TO_CHAR(NOW() - INTERVAL '1 day', 'DD/MM/YYYY')
),
(
  'ALT-805',
  'HIGH',
  'Private Banking Client',
  'CLI-404',
  'Wealth Management Alert',
  3500000,
  'CHF',
  86,
  'investigating',
  NOW() - INTERVAL '2 hours',
  'Switzerland',
  'Portfolio Management',
  'Investment Manager',
  'Large portfolio restructuring',
  TO_CHAR(NOW(), 'DD/MM/YYYY')
),
(
  'ALT-806',
  'MEDIUM',
  'Charity Foundation',
  'CLI-505',
  'Large Donation Review',
  500000,
  'CHF',
  64,
  'pending',
  NOW() - INTERVAL '3 days',
  'Switzerland',
  'Charitable Donation',
  'Non-Profit Organization',
  'Major philanthropic contribution',
  TO_CHAR(NOW() - INTERVAL '3 days', 'DD/MM/YYYY')
),
(
  'ALT-807',
  'LOW',
  'Family Office',
  'CLI-606',
  'Routine Estate Payment',
  75000,
  'CHF',
  38,
  'resolved',
  NOW() - INTERVAL '6 days',
  'Switzerland',
  'Estate Management',
  'Property Manager',
  'Property maintenance fees',
  TO_CHAR(NOW() - INTERVAL '6 days', 'DD/MM/YYYY')
),
(
  'ALT-808',
  'CRITICAL',
  'Shell Corporation Alpha',
  'CLI-707',
  'Suspicious Entity Structure',
  1800000,
  'USD',
  97,
  'pending',
  NOW() - INTERVAL '1 hour',
  'British Virgin Islands',
  'Corporate Transfer',
  'Offshore Entity',
  'Complex ownership structure transfer',
  TO_CHAR(NOW(), 'DD/MM/YYYY')
),
(
  'ALT-809',
  'HIGH',
  'Energy Trading Company',
  'CLI-808',
  'Commodity Trading Alert',
  4200000,
  'USD',
  84,
  'investigating',
  NOW() - INTERVAL '10 hours',
  'United Arab Emirates',
  'Commodity Trade',
  'Oil & Gas Supplier',
  'Large energy commodity purchase',
  TO_CHAR(NOW(), 'DD/MM/YYYY')
);

-- ============================================
-- VERIFY INSERTION
-- ============================================
SELECT 
  COUNT(*) as total_alerts,
  COUNT(CASE WHEN priority = 'CRITICAL' THEN 1 END) as critical,
  COUNT(CASE WHEN priority = 'HIGH' THEN 1 END) as high,
  COUNT(CASE WHEN priority = 'MEDIUM' THEN 1 END) as medium,
  COUNT(CASE WHEN priority = 'LOW' THEN 1 END) as low,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'investigating' THEN 1 END) as investigating,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved
FROM alerts;

-- ============================================
-- VIEW RECENT ALERTS
-- ============================================
SELECT 
  alert_id,
  priority,
  client,
  amount,
  currency,
  status,
  risk_score,
  TO_CHAR(timestamp, 'YYYY-MM-DD HH24:MI') as time
FROM alerts
ORDER BY timestamp DESC
LIMIT 10;

-- ============================================
-- ADDITIONAL USEFUL QUERIES
-- ============================================

-- Get alerts by priority
SELECT priority, COUNT(*) as count
FROM alerts
GROUP BY priority
ORDER BY 
  CASE priority
    WHEN 'CRITICAL' THEN 1
    WHEN 'HIGH' THEN 2
    WHEN 'MEDIUM' THEN 3
    WHEN 'LOW' THEN 4
  END;

-- Get alerts by status
SELECT status, COUNT(*) as count
FROM alerts
GROUP BY status;

-- Get high-value alerts (> 1M)
SELECT alert_id, client, amount, currency, priority
FROM alerts
WHERE amount > 1000000
ORDER BY amount DESC;

-- Get alerts from last 24 hours
SELECT alert_id, client, priority, status
FROM alerts
WHERE timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;

-- Update an alert status (example)
-- UPDATE alerts 
-- SET status = 'resolved', updated_at = NOW()
-- WHERE alert_id = 'ALT-789';

-- Delete specific alert (if needed)
-- DELETE FROM alerts WHERE alert_id = 'ALT-XXX';

