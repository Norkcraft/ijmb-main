
-- Rename price to tuition_fee
alter table centres rename column price to tuition_fee;

-- Add hostel_fee
alter table centres add column if not exists hostel_fee numeric default 0;
