import { Actor, ActorSubclass, HttpAgent, SignIdentity } from "@dfinity/agent";
import { InterfaceFactory } from "@dfinity/candid/lib/cjs/idl";
import { idlFactory } from '../candid/live_detect.idl';
import { _SERVICE } from '../candid/live_detect';
const canisterId = 'gfjra-iaaaa-aaaai-aclia-cai';
export interface CreateActorResult<T> {
  actor: ActorSubclass<T>;
  agent: HttpAgent;
}

export async function _createActor<T>(
  interfaceFactory: InterfaceFactory,
  canisterId: string,
  identity?: SignIdentity,
  host?: string,
): Promise<CreateActorResult<T>> {
  console.log('ENV', NODE_ENV)
  const agent = new HttpAgent({ identity, host: NODE_ENV !== 'production' ? 'http://localhost:8000' : 'https://ic0.app' });
  // Only fetch the root key when we're not in prod
  if (NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }
  const actor = Actor.createActor<T>(interfaceFactory, {
    agent,
    canisterId,
  });
  return { actor, agent };
}


export async function getActor<T>(interfaceFactory: InterfaceFactory, canisterId: string) {
  return await _createActor<T>(interfaceFactory, canisterId)
}

export const connection = await getActor<_SERVICE>(idlFactory, canisterId);