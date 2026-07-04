import { Plan, Member, Payment, Attendance, GymAnnouncement, GymConfig } from '../types';

export const DEFAULT_PLANS: Plan[] = [
  {
    id: 'plan_regular',
    name: 'Regular Plan',
    durationMonths: 1,
    feeAmount: 500,
    description: 'Standard 1-month membership with full equipment access'
  },
  {
    id: 'plan_vip',
    name: 'VIP Plan',
    durationMonths: 3,
    feeAmount: 1500,
    description: 'Premium 3-month VIP membership with locker access'
  }
];

export const DEFAULT_MEMBERS: Member[] = [
  {
    id: 'mem_1',
    name: 'Amit Kushwaha',
    mobile: '9876543210',
    gender: 'Male',
    age: 34,
    address: 'Flat 402, Shanti Heights, Bandra West, Mumbai',
    joiningDate: '2026-01-15',
    planId: 'plan_vip',
    feeAmount: 1500,
    feeDueDate: '2027-01-15',
    emergencyContact: {
      name: 'Neha Kushwaha',
      relation: 'Wife',
      mobile: '9876543211'
    },
    status: 'active'
  },
  {
    id: 'mem_2',
    name: 'Sonu Kumar',
    mobile: '9123456789',
    gender: 'Male',
    age: 28,
    address: 'Plot 15, Hitech City, Hyderabad',
    joiningDate: '2026-05-10',
    planId: 'plan_vip',
    feeAmount: 1500,
    feeDueDate: '2026-08-10',
    emergencyContact: {
      name: 'Rajesh Kumar',
      relation: 'Father',
      mobile: '9123456780'
    },
    status: 'active'
  },
  {
    id: 'mem_3',
    name: 'Gaurav Kumar',
    mobile: '9345678901',
    gender: 'Male',
    age: 42,
    address: 'Sector 4, Indiranagar, Bengaluru',
    joiningDate: '2026-05-04',
    planId: 'plan_vip',
    feeAmount: 1500,
    feeDueDate: '2026-08-04',
    emergencyContact: {
      name: 'Kavita Gaur',
      relation: 'Wife',
      mobile: '9345678900'
    },
    status: 'active'
  },
  {
    id: 'mem_4',
    name: 'Ashish Jha',
    mobile: '9456789012',
    gender: 'Male',
    age: 26,
    address: 'Row House 12, Satellite Area, Ahmedabad',
    joiningDate: '2026-06-04',
    planId: 'plan_regular',
    feeAmount: 500,
    feeDueDate: '2026-07-04',
    emergencyContact: {
      name: 'Harish Jha',
      relation: 'Father',
      mobile: '9456789011'
    },
    status: 'active'
  },
  {
    id: 'mem_5',
    name: 'Anjali Prajapati',
    mobile: '9567890123',
    gender: 'Female',
    age: 24,
    address: 'C-32, Vaishali Nagar, Jaipur',
    joiningDate: '2026-06-15',
    planId: 'plan_regular',
    feeAmount: 500,
    feeDueDate: '2026-07-15',
    emergencyContact: {
      name: 'Sunil Prajapati',
      relation: 'Father',
      mobile: '9567890124'
    },
    status: 'active'
  },
  {
    id: 'mem_6',
    name: 'Amarnath Kumar',
    mobile: '9678901234',
    gender: 'Male',
    age: 29,
    address: 'House 44, Boring Road, Patna',
    joiningDate: '2026-06-18',
    planId: 'plan_regular',
    feeAmount: 500,
    feeDueDate: '2026-07-18',
    emergencyContact: {
      name: 'Savitri Devi',
      relation: 'Mother',
      mobile: '9678901230'
    },
    status: 'active'
  },
  {
    id: 'mem_7',
    name: 'Pooja Sharma',
    mobile: '9789012345',
    gender: 'Female',
    age: 27,
    address: 'G-12, Green Park, New Delhi',
    joiningDate: '2026-05-25',
    planId: 'plan_vip',
    feeAmount: 1500,
    feeDueDate: '2026-08-25',
    emergencyContact: {
      name: 'Rakesh Sharma',
      relation: 'Father',
      mobile: '9789012340'
    },
    status: 'active'
  },
  {
    id: 'mem_8',
    name: 'Deepak Patel',
    mobile: '9890123456',
    gender: 'Male',
    age: 31,
    address: 'Sector 21, Gandhinagar, Gujarat',
    joiningDate: '2026-05-01',
    planId: 'plan_vip',
    feeAmount: 1500,
    feeDueDate: '2026-08-01',
    emergencyContact: {
      name: 'Sonal Patel',
      relation: 'Wife',
      mobile: '9890123450'
    },
    status: 'active'
  },
  {
    id: 'mem_9',
    name: 'Sunita Yadav',
    mobile: '9901234567',
    gender: 'Female',
    age: 30,
    address: 'B-102, Sector 56, Noida',
    joiningDate: '2026-06-28',
    planId: 'plan_regular',
    feeAmount: 500,
    feeDueDate: '2026-07-28',
    emergencyContact: {
      name: 'Dinesh Yadav',
      relation: 'Husband',
      mobile: '9901234560'
    },
    status: 'active'
  },
  {
    id: 'mem_10',
    name: 'Rajesh Mishra',
    mobile: '9012345678',
    gender: 'Male',
    age: 35,
    address: 'Block C, Gomti Nagar, Lucknow',
    joiningDate: '2026-06-12',
    planId: 'plan_regular',
    feeAmount: 500,
    feeDueDate: '2026-07-12',
    emergencyContact: {
      name: 'Alka Mishra',
      relation: 'Wife',
      mobile: '9012345670'
    },
    status: 'active'
  },
  {
    id: 'mem_11',
    name: 'Kiran Devi',
    mobile: '9123456701',
    gender: 'Female',
    age: 45,
    address: 'Street No 3, Kankarbagh, Patna',
    joiningDate: '2026-06-22',
    planId: 'plan_regular',
    feeAmount: 500,
    feeDueDate: '2026-07-22',
    emergencyContact: {
      name: 'Ram Niwas',
      relation: 'Husband',
      mobile: '9123456700'
    },
    status: 'active'
  },
  {
    id: 'mem_12',
    name: 'Sanjay Gupta',
    mobile: '9234567812',
    gender: 'Male',
    age: 33,
    address: 'Flat 204, Salt Lake, Kolkata',
    joiningDate: '2026-05-15',
    planId: 'plan_vip',
    feeAmount: 1500,
    feeDueDate: '2026-08-15',
    emergencyContact: {
      name: 'Rina Gupta',
      relation: 'Wife',
      mobile: '9234567810'
    },
    status: 'active'
  },
  {
    id: 'mem_13',
    name: 'Meena Kumari',
    mobile: '9345678923',
    gender: 'Female',
    age: 26,
    address: 'VIP Road, Zirakpur, Punjab',
    joiningDate: '2026-06-30',
    planId: 'plan_regular',
    feeAmount: 500,
    feeDueDate: '2026-07-30',
    emergencyContact: {
      name: 'Satish Kumar',
      relation: 'Father',
      mobile: '9345678920'
    },
    status: 'active'
  },
  {
    id: 'mem_14',
    name: 'Vikram Singh',
    mobile: '9456789034',
    gender: 'Male',
    age: 28,
    address: 'JDA Colony, Shastri Nagar, Jammu',
    joiningDate: '2026-06-09',
    planId: 'plan_regular',
    feeAmount: 500,
    feeDueDate: '2026-07-09',
    emergencyContact: {
      name: 'Karan Singh',
      relation: 'Brother',
      mobile: '9456789030'
    },
    status: 'active'
  },
  {
    id: 'mem_15',
    name: 'Ritu Raj',
    mobile: '9567890145',
    gender: 'Female',
    age: 23,
    address: 'Kalyani Nagar, Pune',
    joiningDate: '2026-05-20',
    planId: 'plan_vip',
    feeAmount: 1500,
    feeDueDate: '2026-08-20',
    emergencyContact: {
      name: 'Sohan Raj',
      relation: 'Father',
      mobile: '9567890140'
    },
    status: 'active'
  },
  {
    id: 'mem_16',
    name: 'Aman Verma',
    mobile: '9678901256',
    gender: 'Male',
    age: 22,
    address: 'Civil Lines, Prayagraj',
    joiningDate: '2026-06-11',
    planId: 'plan_regular',
    feeAmount: 500,
    feeDueDate: '2026-07-11',
    emergencyContact: {
      name: 'Pradeep Verma',
      relation: 'Father',
      mobile: '9678901250'
    },
    status: 'active'
  },
  {
    id: 'mem_17',
    name: 'Jyoti Maurya',
    mobile: '9789012367',
    gender: 'Female',
    age: 27,
    address: 'Sector 15, Vasundhara, Ghaziabad',
    joiningDate: '2026-06-24',
    planId: 'plan_regular',
    feeAmount: 500,
    feeDueDate: '2026-07-24',
    emergencyContact: {
      name: 'Anup Maurya',
      relation: 'Brother',
      mobile: '9789012360'
    },
    status: 'active'
  },
  {
    id: 'mem_18',
    name: 'Pankaj Dubey',
    mobile: '9890123478',
    gender: 'Male',
    age: 36,
    address: 'Saket, New Delhi',
    joiningDate: '2026-05-08',
    planId: 'plan_vip',
    feeAmount: 1500,
    feeDueDate: '2026-08-08',
    emergencyContact: {
      name: 'Sushma Dubey',
      relation: 'Wife',
      mobile: '9890123470'
    },
    status: 'active'
  },
  {
    id: 'mem_19',
    name: 'Kajal Singh',
    mobile: '9901234589',
    gender: 'Female',
    age: 25,
    address: 'Shyam Nagar, Kanpur',
    joiningDate: '2026-06-29',
    planId: 'plan_regular',
    feeAmount: 500,
    feeDueDate: '2026-07-29',
    emergencyContact: {
      name: 'Vijay Singh',
      relation: 'Father',
      mobile: '9901234580'
    },
    status: 'active'
  },
  {
    id: 'mem_20',
    name: 'Rohan Saxena',
    mobile: '9012345690',
    gender: 'Male',
    age: 27,
    address: 'Model Town, Bareilly',
    joiningDate: '2026-06-06',
    planId: 'plan_regular',
    feeAmount: 500,
    feeDueDate: '2026-07-06',
    emergencyContact: {
      name: 'Anshu Saxena',
      relation: 'Sister',
      mobile: '9012345600'
    },
    status: 'active'
  }
];

export const DEFAULT_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    memberId: 'mem_1',
    memberName: 'Amit Kushwaha',
    planName: 'VIP Plan',
    amount: 1500,
    paymentDate: '2026-01-15',
    status: 'paid',
    dueDate: '2027-01-15',
    receiptNumber: 'REC-2026-001'
  },
  {
    id: 'pay_2',
    memberId: 'mem_2',
    memberName: 'Sonu Kumar',
    planName: 'VIP Plan',
    amount: 1500,
    paymentDate: '2026-05-10',
    status: 'paid',
    dueDate: '2026-08-10',
    receiptNumber: 'REC-2026-002'
  },
  {
    id: 'pay_3',
    memberId: 'mem_3',
    memberName: 'Gaurav Kumar',
    planName: 'VIP Plan',
    amount: 1500,
    paymentDate: '2026-05-04',
    status: 'paid',
    dueDate: '2026-08-04',
    receiptNumber: 'REC-2026-003'
  },
  {
    id: 'pay_4',
    memberId: 'mem_4',
    memberName: 'Ashish Jha',
    planName: 'Regular Plan',
    amount: 500,
    paymentDate: '2026-06-04',
    status: 'paid',
    dueDate: '2026-07-04',
    receiptNumber: 'REC-2026-004'
  },
  {
    id: 'pay_5',
    memberId: 'mem_5',
    memberName: 'Anjali Prajapati',
    planName: 'Regular Plan',
    amount: 500,
    paymentDate: '2026-06-15',
    status: 'paid',
    dueDate: '2026-07-15',
    receiptNumber: 'REC-2026-005'
  }
];

export const DEFAULT_ATTENDANCE: Attendance[] = [
  {
    id: 'att_1',
    memberId: 'mem_1',
    memberName: 'Amit Kushwaha',
    date: '2026-07-03',
    checkInTime: '06:15:30 AM',
    method: 'manual'
  },
  {
    id: 'att_2',
    memberId: 'mem_2',
    memberName: 'Sonu Kumar',
    date: '2026-07-03',
    checkInTime: '08:30:15 AM',
    method: 'manual'
  },
  {
    id: 'att_3',
    memberId: 'mem_4',
    memberName: 'Ashish Jha',
    date: '2026-07-03',
    checkInTime: '07:12:00 AM',
    method: 'manual'
  },
  {
    id: 'att_4',
    memberId: 'mem_1',
    memberName: 'Amit Kushwaha',
    date: '2026-07-04',
    checkInTime: '06:10:12 AM',
    method: 'manual'
  },
  {
    id: 'att_5',
    memberId: 'mem_5',
    memberName: 'Anjali Prajapati',
    date: '2026-07-04',
    checkInTime: '07:22:45 AM',
    method: 'manual'
  }
];

export const DEFAULT_NOTIFICATIONS: GymAnnouncement[] = [
  {
    id: 'not_1',
    title: 'New Strength Equipment Arrived!',
    message: 'We are thrilled to announce that 3 new Hammer Strength machines have been installed in the main floor area. Check them out tomorrow!',
    date: '2026-07-02',
    type: 'announcement'
  },
  {
    id: 'not_2',
    title: 'Weekend Cardio Burnout Session',
    message: 'Join us for a specialized HIIT and Cardio Burnout session this Sunday at 08:00 AM with Master Coach Amit.',
    date: '2026-07-03',
    type: 'promo'
  },
  {
    id: 'not_3',
    title: 'Membership Fee Due Soon',
    message: 'Dear Ashish, your Regular Plan membership is expiring on 2026-07-04. Please renew to keep accessing gym premises.',
    date: '2026-07-03',
    type: 'fee_due',
    targetMemberId: 'mem_4'
  }
];

export const DEFAULT_GYM_CONFIG: GymConfig = {
  name: 'RS FITNESS',
  mobile: '+91 99999 99999',
  address: 'Level 4, Hitech City Metro Station, Hyderabad, Telangana, India',
  whatsappTemplate: 'Hello *{name}*! This is an automatic reminder from *RS FITNESS* that your fee of *₹{amount}* is due on *{dueDate}*. Please pay soon to continue your access. Thank you!'
};
