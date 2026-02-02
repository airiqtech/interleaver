import { UserBackendDTO, UserDTO } from "./user.types";

/**
 * Adapters isolate backend DTOs from frontend contracts.
 * No backend shape should leak beyond this file.
 */
export class UserAdapter {
  static toUser(frontendId: number, backend: UserBackendDTO): UserDTO {
    return {
      id: frontendId,
      firstName: backend.firstName,
      lastName: backend.lastName,
      maidenName: backend.maidenName,
      age: backend.age,
      gender: backend.gender,
      email: backend.email,
      phone: backend.phone,
      username: backend.username,
      birthDate: backend.birthDate,
      image: backend.image,
      bloodGroup: backend.bloodGroup,
      height: backend.height,
      weight: backend.weight,
      eyeColor: backend.eyeColor,
      hair: {
        color: backend.hair.color,
        type: backend.hair.type,
      },
      address: {
        address: backend.address.address,
        city: backend.address.city,
        state: backend.address.state,
        stateCode: backend.address.stateCode,
        postalCode: backend.address.postalCode,
        coordinates: backend.address.coordinates,
        country: backend.address.country,
      },
      university: backend.university,
      bank: {
        cardExpire: backend.bank.cardExpire,
        cardNumber: backend.bank.cardNumber,
        cardType: backend.bank.cardType,
        currency: backend.bank.currency,
        iban: backend.bank.iban,
      },
        company: {
        department: backend.company.department,
        name: backend.company.name,
        title: backend.company.title,
        address: {
          address: backend.company.address.address,
          city: backend.company.address.city,
          state: backend.company.address.state,
          stateCode: backend.company.address.stateCode,
          postalCode: backend.company.address.postalCode,
          coordinates: backend.company.address.coordinates,
          country: backend.company.address.country,
        },
      },
      role: backend.role,
    };
  }
}
