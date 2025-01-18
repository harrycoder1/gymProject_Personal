// import { Membership } from '../models/MembershipModel.js';
import { Membership } from '../models/MembershipSchema.js';
import { responseSender } from '../utils/index.js';
import { ERROR_MSG } from '../content/index.js';

// Create a new membership
export const createMembership = async (req, res) => {
  const { gymId ,  type, duration, fee, status } = req.body;
  
  try {
    // Check if membership already exists
    const exists = await Membership.findOne({ gymId, type, duration });
    if (exists) {
      return responseSender(
        'This Membership already exists for the selected gym and type.',
        false,
        400,
        res
      );
    }

    const membership = new Membership({ ...req.body });
    await membership.save();

    return responseSender(
      'New membership created successfully!',
      true,
      201,
      res,
      { data: membership }
    );
  } catch (error) {
    console.log(error);
    return responseSender(ERROR_MSG, false, 500, res, { error: error });
  }
};

// Get membership by ID
export const getMembershipById = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);

    if (!membership)
      return responseSender('Membership not found', false, 404, res);

    return responseSender(
      'Membership fetched by ID successfully!',
      true,
      200,
      res,
      { data: membership }
    );
  } catch (error) {
    return responseSender(ERROR_MSG, false, 500, res, { error: error });
  }
};

// Update a membership by ID
export const updateMembership = async (req, res) => {
  try {
    const id = req.params.id
    const {gymId } = req.body
    const isGymMembership = Membership.findOne({gymId:gymId , _id:id})
    if(!isGymMembership){
      return responseSender("MemberShip Not Found !" , false , 404 , res)
    }

    const membership = await Membership.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!membership)
      return responseSender('Membership Not Found', false, 404, res);

    return responseSender(
      'Membership updated successfully!',
      true,
      200,
      res,
      { data: membership }
    );
  } catch (error) {
    return responseSender(ERROR_MSG, false, 500, res, { error: error });
  }
};

// Delete a membership by ID
export const deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findByIdAndDelete(req.params.id);

    if (!membership)
      return responseSender('Membership not found!', false, 404, res);

    return responseSender(
      'Membership deleted successfully!',
      true,
      200,
      res
    );
  } catch (error) {
    return responseSender(ERROR_MSG, false, 500, res, { error: error });
  }
};

// Get all memberships
export const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find().populate('gymId' , 'gymId gLocation address profileImg');

    return responseSender(
      'All memberships fetched successfully!',
      true,
      200,
      res,
      { data: memberships }
    );
  } catch (error) {
    return responseSender(ERROR_MSG, false, 500, res, { error: error });
  }
};

// Get memberships by gym_id
export const getMembershipsByGymId = async (req, res) => {
  const { gymId } = req.params;
  try {
    const memberships = await Membership.find({ gymId:gymId });

    return responseSender(
      'Gym memberships fetched successfully!',
      true,
      200,
      res,
      { data: memberships }
    );
  } catch (error) {
    return responseSender(ERROR_MSG, false, 500, res, { error: error });
  }
};

// Get memberships by type
export const getMembershipsByType = async (req, res) => {
  const { type } = req.params;
  try {
    const memberships = await Membership.find({ type });

    return responseSender(
      'Memberships by type fetched successfully!',
      true,
      200,
      res,
      { data: memberships }
    );
  } catch (error) {
    return responseSender(ERROR_MSG, false, 500, res, { error: error });
  }
};
